import { useNavigate } from "react-router-dom";
import { activityInterval, task } from "../utility/types";
import { format } from "date-fns";

interface TaskSummaryProp {
  overlaps: boolean[];
  task: task;
  newInterval: activityInterval;
  activityIntervals: activityInterval[];
  handleRemoveInterval: (interval: activityInterval) => void;
  handleModifyInterval: (oldInterval: activityInterval, newInterval: activityInterval) => void;
}

function TaskSummary({ overlaps, newInterval, activityIntervals, task, handleModifyInterval, handleRemoveInterval }: TaskSummaryProp) {
  const navigate = useNavigate();

  return (
    <div className="task-summary">
      <h2 className="task-summary-detail">
        <button type="button" onClick={() => navigate(`/`)}>
          Go Back
        </button>
        <p>{task.name}</p>
      </h2>
      <ul className="activity-intervals">
        {activityIntervals.map((interval, index) => {
          return (
            <li key={index} className={overlaps[index] ? "overlap" : ""}>
              {format(interval.start, "yyyy-MM-dd HH:mm")} - {interval.end ? format(interval.end, "yyyy-MM-dd HH:mm") : "Ongoing"}
              {overlaps[index] && index === overlaps.indexOf(true) && <p>Overlap detected</p>}
              <div className="button-container">
                <button onClick={() => handleRemoveInterval(interval)}>
                  Remove
                </button>
                <button onClick={() => handleModifyInterval(interval, newInterval)}>
                  Modify
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TaskSummary;