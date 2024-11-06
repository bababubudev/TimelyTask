// import { useParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Summary from "../components/Summary";
import { useData } from "../context/DataContext";
import { IoReload } from "react-icons/io5";
import TaskSummary from "../components/TaskSummary";
import { activityInterval } from "../utility/types";
import { checkForOverlaps } from "../utility/utilityComponent";
import DetailIntervals from "../components/DetailIntervals";
import TaskIntervals from "../components/TaskIntervals";
import { useState } from "react";
import { endOfDay, format, parseISO, startOfDay } from "date-fns";
import DailyActivityChart from "../components/DailyActivityChart";
// import { useData } from "../context/DataContext";
// import { useEffect, useState } from "react";
// import { task } from "../utility/types";

function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [chartInterval, setChartInterval] = useState<{ start: Date; end: Date }>({
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
  });

  const {
    tasks,
    tagMap,

    observationInterval,
    setObservationInterval,
    taskDetailsInterval,
    setTaskDetailsInterval,
    getActivityIntervals,

    addActivityInterval,
    removeActivityInterval,
    modifyActivityInterval,

    taskActiveTimes,
    activeTasks,
    calculateDailyActiveTimes,

    tagActiveTimes,
    optionLoading,
    optionError,
  } = useData();

  const handleIntervalChange = (start: Date, end: Date) => {
    if (!(start && end)) {
      return;
    }

    if (start.getTime() < end.getTime()) {
      setTaskDetailsInterval({ start, end });
      setObservationInterval({ start, end })
    };
  };

  const handleChartIntervalChange = (start: Date, end: Date) => {
    if (!(start && end)) {
      return;
    }

    if (start.getTime() < end.getTime()) {
      setChartInterval({ start, end });
    }
  };

  const handleAddInterval = () => {
    if (id) {
      addActivityInterval(parseInt(id), taskDetailsInterval);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleRemoveInterval = (interval: activityInterval) => {
    if (id) {
      removeActivityInterval(parseInt(id), interval);
    }
  };

  const handleModifyInterval = (oldInterval: activityInterval, newInterval: activityInterval) => {
    if (id) {
      modifyActivityInterval(parseInt(id), oldInterval, newInterval);
    }
  };

  const currentTask = tasks.find(task => task.id === parseInt(id || ""));
  const activityIntervals = getActivityIntervals(parseInt(id || ""), taskDetailsInterval.start, taskDetailsInterval.end ?? new Date());
  const dailyActiveTimes = calculateDailyActiveTimes(parseInt(id || ""), chartInterval.start, chartInterval.end);

  const chartData = Object.entries(dailyActiveTimes).map(([date, activeTime]) => ({
    date: format(parseISO(date), "yyyy-MM-dd"),
    activeTime: (activeTime / 1000 / 60).toFixed(2),
  }));

  const overlaps = checkForOverlaps(activityIntervals);

  return (
    <div className="page details-page">
      <Header />
      <div className="page-header">
        <h1>Details</h1>
        <button onClick={handleReload} className="reload-button">
          <IoReload />
          <p>reload</p>
        </button>
      </div>
      <div className="content details-content">
        <div className="interval-picker">
          <DetailIntervals
            observationInterval={observationInterval}
            handleIntervalChange={handleIntervalChange}
          />
          {id &&
            <TaskIntervals
              newInterval={taskDetailsInterval}
              setNewInterval={setTaskDetailsInterval}
              handleAddInterval={handleAddInterval}
            />
          }
        </div>
        {id ?
          <TaskSummary
            overlaps={overlaps}
            task={currentTask ?? { id: -1, name: "Something went wrong :/", tags: "" }}
            activityIntervals={activityIntervals}
            newInterval={taskDetailsInterval}
            handleRemoveInterval={handleRemoveInterval}
            handleModifyInterval={handleModifyInterval}
          /> :
          <Summary
            taskActiveTimes={taskActiveTimes}
            tagActiveTimes={tagActiveTimes}
            tasks={tasks}
            tagMap={tagMap}
            activeTaskMap={activeTasks}
          />
        }
        {id &&
          <>
            <div className="interval-picker chart-intervals">
              <label>
                <p>Chart Start Date</p>
                <input
                  type="date"
                  value={format(chartInterval.start, "yyyy-MM-dd")}
                  onChange={e => handleChartIntervalChange(parseISO(e.target.value), chartInterval.end)}
                />
              </label>
              <label>
                <p>Chart End Date</p>
                <input
                  type="date"
                  value={format(chartInterval.end, "yyyy-MM-dd")}
                  onChange={e => handleChartIntervalChange(chartInterval.start, parseISO(e.target.value))}
                />
              </label>
            </div>
            <DailyActivityChart data={chartData} />
          </>
        }
      </div>
      {optionLoading && <p>Loading...</p>}
      {optionError && <p>Error: {optionError.message}</p>}
    </div>
  );
}

export default DetailPage;