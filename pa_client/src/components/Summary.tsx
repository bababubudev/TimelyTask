import { useEffect, useState } from "react";
import type { activeTime, mappedTag, task, taskActivityMap } from "../utility/types";
import { formatDuration } from "../utility/utilityComponent";

interface SummaryProps {
  taskActiveTimes: activeTime;
  tagActiveTimes: activeTime;
  tasks: task[];
  tagMap: mappedTag;
  activeTaskMap: taskActivityMap;
}

function Summary({ taskActiveTimes, tagActiveTimes, tasks, tagMap, activeTaskMap }: SummaryProps) {
  const [currentTimes, setCurrentTimes] = useState<activeTime>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimes(prevTimes => {
        const newTimes: activeTime = { ...prevTimes };
        Object.entries(activeTaskMap).forEach(([taskId, isActive]) => {
          if (isActive) {
            newTimes[taskId] = (newTimes[taskId] || taskActiveTimes[taskId] || 0) + 1000;
          }
        });
        return newTimes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTaskMap, taskActiveTimes]);

  return (
    <div className="summary">
      <div className="task-summary">
        <h2>Task Summary</h2>
        <ul>
          {Object.entries(taskActiveTimes).map(([taskId, time]) => {
            const task = tasks.find(t => t.id === parseInt(taskId));
            const displayTime = activeTaskMap[parseInt(taskId)] ? currentTimes[taskId] : time;
            return (
              <li key={taskId}>
                {task?.name}: {formatDuration(displayTime)}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="tag-summary">
        <h2>Tag Summary</h2>
        <ul>
          {Object.entries(tagActiveTimes).map(([tagId, time]) => (
            tagMap[tagId] && (
              <li key={tagId}>
                {tagMap[tagId]}: {formatDuration(time)}
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Summary;