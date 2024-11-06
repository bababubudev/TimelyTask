import { useCallback, useEffect, useMemo, useState } from "react";
import { OptionsContext } from "./DataContext";
import type { mappedTag, options, tag, task, timestampMap, taskActivityMap, timestamp, observationInterval, activeTime, activityInterval, ThemeType } from "../utility/types";
import { BASE_URL } from "../utility/utilityComponent";
import { differenceInMilliseconds, eachDayOfInterval, endOfDay, formatISO, parseISO, startOfDay } from "date-fns";

interface DataProviderProps {
  children: React.ReactNode;
}

function DataProvider({ children }: DataProviderProps) {
  const [tasks, setTasks] = useState<task[]>([]);

  // const [timestamps, setTimestamps] = useState<timestamp[]>([]);
  const [timestampMap, setTimestampMap] = useState<timestampMap>({});
  const [activeTasks, setActiveTasks] = useState<taskActivityMap>({});

  const [tagMap, setTagMap] = useState<mappedTag>({});
  const [options, setOptions] = useState<options | null>(null);

  const [optionError, setOptionError] = useState<Error | null>(null);
  const [optionLoading, setOptionLoading] = useState<boolean>(false);

  const [observationInterval, setObservationInterval] = useState<observationInterval>({
    start: startOfDay(new Date()),
    end: new Date()
  });

  const [taskDetailsInterval, setTaskDetailsInterval] = useState<activityInterval>({
    start: startOfDay(new Date()),
    end: new Date()
  });

  const fetchData = useCallback(async (url: string, options: RequestInit = {}) => {
    setOptionLoading(true);
    setOptionError(null);
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (err) {
      setOptionError(new Error("Failed to fetch data"));
      console.error("[ Error fetching data ]\n", err);
    } finally {
      setOptionLoading(false);
    }
  }, []);

  const calculateActiveTimes = useCallback((start: Date, end: Date) => {
    const taskActiveTimes: activeTime = {};
    const tagActiveTimes: activeTime = {};

    Object.entries(timestampMap).forEach(([taskId, timestamps]) => {
      let totalActiveTime = 0;
      let lastStartTime: Date | null = null;

      timestamps.forEach(ts => {
        const timestamp = parseISO(ts.timestamp);
        if (timestamp >= start && timestamp <= end) {
          if (ts.type === 0) {
            lastStartTime = timestamp;
          } else if (ts.type === 1 && lastStartTime) {
            totalActiveTime += (timestamp.getTime() - lastStartTime.getTime());
            lastStartTime = null;
          }
        }
      });

      if (lastStartTime) {
        totalActiveTime += (end.getTime() - (lastStartTime as Date).getTime());
      }

      if (totalActiveTime > 0) {
        taskActiveTimes[parseInt(taskId)] = totalActiveTime;
        const task = tasks.find(t => t.id === parseInt(taskId));
        if (task) {
          task.tags.split(',').forEach(tagId => {
            if (!tagActiveTimes[tagId]) {
              tagActiveTimes[tagId] = 0;
            }
            tagActiveTimes[tagId] += totalActiveTime;
          });
        }
      }
    });

    return { taskActiveTimes, tagActiveTimes };
  }, [tasks, timestampMap]);

  const calculateDailyActiveTimes = useCallback((taskId: number, start: Date, end: Date): activeTime => {
    const dailyActiveTimes: activeTime = {};
    const timestamps = timestampMap[taskId] || [];

    const days = eachDayOfInterval({ start, end });

    days.forEach(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      let totalActiveTime = 0;
      let lastStartTime: Date | null = null;

      timestamps.forEach(ts => {
        const timestamp = parseISO(ts.timestamp);
        if (timestamp >= dayStart && timestamp <= dayEnd) {
          if (ts.type === 0) {
            lastStartTime = timestamp;
          } else if (ts.type === 1 && lastStartTime) {
            totalActiveTime += differenceInMilliseconds(timestamp, lastStartTime);
            lastStartTime = null;
          }
        }
      });

      if (lastStartTime) {
        totalActiveTime += differenceInMilliseconds(dayEnd, lastStartTime);
      }

      dailyActiveTimes[dayStart.toISOString()] = totalActiveTime;
    });

    return dailyActiveTimes;
  }, [timestampMap]);

  const getActivityIntervals = useCallback((taskId: number, start: Date, end: Date): activityInterval[] => {
    const intervals: { start: Date, end: Date | null }[] = [];
    const timestamps = timestampMap[taskId] || [];

    let lastStartTime: Date | null = null;

    timestamps.forEach(ts => {
      const timestamp = parseISO(ts.timestamp);
      if (timestamp >= start && timestamp <= end) {
        if (ts.type === 0) {
          lastStartTime = timestamp;
        } else if (ts.type === 1 && lastStartTime) {
          intervals.push({ start: lastStartTime, end: timestamp });
          lastStartTime = null;
        }
      }
    });

    if (lastStartTime) {
      intervals.push({ start: lastStartTime, end: null });
    }

    return intervals;
  }, [timestampMap]);

  const fetchAllData = useCallback(async () => {
    try {
      const [tasks, tags, timestamps, options] = await Promise.all([
        fetchData(`${BASE_URL}/tasks`),
        fetchData(`${BASE_URL}/tags`),
        fetchData(`${BASE_URL}/timestamps`),
        fetchData(`${BASE_URL}/options/1`),
      ]);

      const [tasksData, tagsData, timestampData, optionsData] = await Promise.all([
        tasks,
        tags,
        timestamps,
        options
      ]);

      const tagMap: mappedTag = {};
      const newstamp: timestampMap = {};
      const newActivity: taskActivityMap = {};

      tagsData.forEach((tag: tag) => { tagMap[tag.id] = tag.name });

      timestampData.sort((a: timestamp, b: timestamp) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .forEach((elem: timestamp) => {
          if (!newstamp[elem.task]) {
            newstamp[elem.task] = [];
          }

          newstamp[elem.task].push(elem);
          newActivity[elem.task] = elem.type === 0;
        });

      setTasks(tasksData);
      setTagMap(tagMap);

      // setTimestamps(timestampData);
      setTimestampMap(newstamp);
      setActiveTasks(newActivity);
      setOptions(optionsData[0]);
    } catch (err) {
      console.log("[ Error fetching options and tags ]\n", err);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const applyTheme = (theme: ThemeType) => {
    document.documentElement.classList.remove("light", "dark", "default");
    document.documentElement.classList.add(theme);
  };

  const handleSetOptions = async (changes: Partial<options>) => {
    try {
      await fetchData(`${BASE_URL}/options/1`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      setOptions(prev => {
        const newOptions = { ...prev, ...changes } as options;
        if (changes.theme) {
          applyTheme(changes.theme);
        }
        return newOptions;
      });
    } catch (err) {
      setOptionError(new Error("Failed to update options"));
      console.error("Error updating options:", err);
    }
  };

  const addActivityInterval = async (taskId: number, interval: activityInterval) => {
    try {
      setOptionLoading(true);
      const response = await fetch(`${BASE_URL}/timestamps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: taskId,
          timestamp: formatISO(interval.start),
          type: 0
        })
      });

      const startTimestamp = await response.json();
      console.log("start timestamp", startTimestamp);

      if (interval.end) {
        await fetch(`${BASE_URL}/timestamps`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task: taskId,
            timestamp: formatISO(interval.end),
            type: 1
          })
        });
      }

      fetchAllData();
    } catch (err) {
      setOptionError(new Error("Failed to add activity interval"));
      console.error("[ Error adding activity interval ]\n", err);
    } finally {
      setOptionLoading(false);
    }
  };

  const removeActivityInterval = async (taskId: number, interval: activityInterval) => {
    try {
      setOptionLoading(true);
      const timestamps = timestampMap[taskId] || [];
      const startTimestamp = timestamps.find(ts => ts.timestamp === formatISO(interval.start) && ts.type === 0);
      const endTimestamp = interval.end ? timestamps.find(ts => ts.timestamp === formatISO(interval.end ?? "") && ts.type === 1) : null;

      if (startTimestamp) {
        await fetch(`${BASE_URL}/timestamps/${startTimestamp.id}`, { method: "DELETE" });
      }
      if (endTimestamp) {
        await fetch(`${BASE_URL}/timestamps/${endTimestamp.id}`, { method: "DELETE" });
      }

      fetchAllData();
    } catch (err) {
      setOptionError(new Error("Failed to remove activity interval"));
      console.error("[ Error removing activity interval ]\n", err);
    } finally {
      setOptionLoading(false);
    }
  };

  const modifyActivityInterval = async (taskId: number, oldInterval: activityInterval, newInterval: activityInterval) => {
    try {
      setOptionLoading(true);
      await removeActivityInterval(taskId, oldInterval);
      await addActivityInterval(taskId, newInterval);
    } catch (err) {
      setOptionError(new Error("Failed to modify activity interval"));
      console.error("[ Error modifying activity interval ]\n", err);
    } finally {
      setOptionLoading(false);
    }
  };

  const setAllTask = (data: task[]) => {
    setTasks(data);
  }

  const setTagAddition = async (tagName: string) => {
    console.log("adding new tag", tagName);

    const isExisting = Object.values(tagMap).includes(tagName);
    if (isExisting) return;

    try {
      const { id } = await fetchData(`${BASE_URL}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagName })
      });
      setTagMap(prev => ({ ...prev, [id]: tagName }));
    } catch (err) {
      setOptionError(new Error("Adding tag failed"));
      console.log("[ Adding tag failed ]\n", err);
    }
  };

  const setTagDeletion = async (id: number) => {
    try {
      await fetchData(`${BASE_URL}/tags/${id}`, { method: "DELETE" });
      setTagMap(prev => {
        const updatedEntries = Object.entries(prev).filter(([key]) => key !== id.toString());
        return Object.fromEntries(updatedEntries);
      });
    } catch (err) {
      setOptionError(new Error("Deleting tag failed"));
      console.log("[ Deleting tag failed ]\n", err);
    }
  };

  const setTaskAdd = async (content: task) => {
    const { name, tags } = content;

    try {
      setOptionLoading(true);
      setOptionError(null);

      const postResponse = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tags })
      });

      const { id } = await postResponse.json();
      setTasks((prev) => [...prev, { id, name, tags }]);
      console.log("adding task", { id, name, tags });
    }
    catch (err) {
      setOptionError(new Error("Adding task failed"));
      console.log("[ Adding task failed ]\n", err);
    }
    finally {
      setOptionLoading(false);
    }
  };

  const setTaskEdit = async (updatedTask: task) => {
    const { id, name, tags } = updatedTask;

    try {
      setOptionLoading(true);
      setOptionError(null);

      await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tags })
      });

      setTasks(prev =>
        prev.map(elem => (elem.id === id ? updatedTask : elem))
      );
    }
    catch (err) {
      console.log("[ Editing task failed ]\n", err);
      setOptionError(new Error("Editing task failed"));
    }
    finally {
      setOptionLoading(false);
    }
  };

  const setTaskDelete = async (id: number) => {
    try {
      setOptionLoading(true);

      // const deletionTimes = timestamps.map(elem => elem.task === id ? elem : null).filter(elem => elem !== null);
      // console.log(deletionTimes);
      // await Promise.all(deletionTimes.map(elem => fetch(`${BASE_URL}/timesfortask/${elem.id}`, { method: "DELETE" })));
      await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });

      const updated = tasks.filter(task => task.id !== id);
      setTasks(updated);
    }
    catch (err) {
      console.log("[ Deleting task failed ]\n", err);
      setOptionError(new Error("Deleting task failed"));
    }
    finally {
      setOptionLoading(false);
    }
  };

  const toggleActiveTask = async (taskId: number) => {
    const isActive = activeTasks[taskId];

    try {
      setOptionLoading(true);
      setOptionError(null);

      const newTimestamp = {
        timestamp: formatISO(new Date()),
        task: taskId,
        type: isActive ? 1 : 0
      };

      await fetch(`${BASE_URL}/timestamps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTimestamp)
      });

      setActiveTasks(prev => {
        const updatedActiveTasks: taskActivityMap = { ...prev, [taskId]: !isActive };
        if (options?.alternative === 1 && !isActive) {
          Object.keys(updatedActiveTasks).forEach(id => {
            if (parseInt(id) !== taskId) {
              updatedActiveTasks[parseInt(id)] = false;
            }
          });
        }
        return updatedActiveTasks;
      });

      setTimestampMap(prev => {
        const updatedTimestamps = prev[taskId] ? [...prev[taskId], newTimestamp] : [newTimestamp];
        return { ...prev, [taskId]: updatedTimestamps };
      });
    }
    catch (err) {
      setOptionError(new Error("Toggling task state failed"));
      console.log("[ Toggling task state failed ]\n", err);
    }
    finally {
      setOptionLoading(false);
    }
  }

  const memoizedTasks = useMemo(() => tasks, [tasks]);
  const memoizedTimestampMap = useMemo(() => timestampMap, [timestampMap]);
  const memoizedActiveTasks = useMemo(() => activeTasks, [activeTasks]);
  const memoizedOptions = useMemo(() => options, [options]);
  const memoizedTagMap = useMemo(() => tagMap, [tagMap]);
  const { taskActiveTimes, tagActiveTimes } = useMemo(() =>
    calculateActiveTimes(observationInterval.start, observationInterval.end),
    [observationInterval, calculateActiveTimes]
  );

  return (
    <OptionsContext.Provider
      value={{
        tasks: memoizedTasks,
        timestampMap: memoizedTimestampMap,
        activeTasks: memoizedActiveTasks,
        taskActiveTimes,
        tagActiveTimes,
        taskDetailsInterval,
        observationInterval,
        tagMap: memoizedTagMap,
        options: memoizedOptions,

        setAllTask,
        setTaskAdd,
        setTaskEdit,
        setTaskDelete,
        setTagAddition,
        setTagDeletion,
        setOptions: handleSetOptions,

        toggleActiveTask,
        getActivityIntervals,
        addActivityInterval,
        removeActivityInterval,
        modifyActivityInterval,
        setTaskDetailsInterval,
        setObservationInterval,
        calculateDailyActiveTimes,

        optionLoading,
        optionError,
        fetchAllData
      }}
    >
      {children}
    </OptionsContext.Provider>
  )
}

export default DataProvider;