import { useCallback, useEffect, useMemo, useState } from "react";
import { OptionsContext } from "./DataContext";
import type { mappedTag, options, tag, task, timestampMap, taskActivityMap, timestamp } from "../utility/types";
import { BASE_URL } from "../utility/utilityComponent";

interface DataProviderProps {
  children: React.ReactNode;
}

function DataProvider({ children }: DataProviderProps) {
  const [tasks, setTasks] = useState<task[]>([]);
  const [timestampMap, setTimestampMap] = useState<timestampMap>({});
  const [activeTasks, setActiveTasks] = useState<taskActivityMap>({});

  const [tagMap, setTagMap] = useState<mappedTag>({});
  const [options, setOptions] = useState<options | null>(null);

  const [optionError, setOptionError] = useState<Error | null>(null);
  const [optionLoading, setOptionLoading] = useState<boolean>(false);

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

  useEffect(() => {
    const fetchAllData = async () => {
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

        timestampData.forEach((elem: timestamp) => {
          if (!newstamp[elem.task]) {
            newstamp[elem.task] = [];
          }

          newstamp[elem.task].push(elem);
          newActivity[elem.task] = elem.type === 0;
        });

        setTasks(tasksData);
        setTagMap(tagMap);

        setTimestampMap(newstamp);
        setActiveTasks(newActivity);
        setOptions(optionsData[0]);
      } catch (err) {
        console.log("[ Error fetching options and tags ]\n", err);
      }
    };

    fetchAllData();
  }, [fetchData]);

  const handleSetOptions = async (changes: Partial<options>) => {
    try {
      await fetchData(`${BASE_URL}/options/1`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      setOptions(prev => ({ ...prev, ...changes }) as options);
    } catch (err) {
      setOptionError(new Error("Failed to update options"));
      console.error("Error updating options:", err);
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
      await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });

      const updated = tasks.filter(task => task.id !== id)
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

      await fetch(`${BASE_URL}/timestamps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          task: taskId,
          type: isActive ? 1 : 0
        })
      });

      setActiveTasks(prev => ({ ...prev, [taskId]: !isActive }));
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

  return (
    <OptionsContext.Provider
      value={{
        tasks: memoizedTasks,
        timestampMap: memoizedTimestampMap,
        activeTasks: memoizedActiveTasks,
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

        optionLoading,
        optionError
      }}
    >
      {children}
    </OptionsContext.Provider>
  )
}

export default DataProvider;