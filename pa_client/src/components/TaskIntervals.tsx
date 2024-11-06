import { format, parseISO } from "date-fns";

interface TaskIntervalsProps {
  newInterval: {
    start: Date;
    end: Date | null;
  };
  setNewInterval: (newInterval: { start: Date; end: Date | null }) => void;
  handleAddInterval: () => void;
}

function TaskIntervals({ newInterval, setNewInterval, handleAddInterval }: TaskIntervalsProps) {
  return (
    <div className="task-intervals">
      <label>
        <p>Interval Start</p>
        <input
          type="datetime-local"
          value={format(newInterval.start, "yyyy-MM-dd'T'HH:mm")}
          onChange={e => setNewInterval({ ...newInterval, start: parseISO(e.target.value) })}
        />
      </label>
      <label>
        <p>Interval End</p>
        <input
          type="datetime-local"
          value={newInterval.end ? format(newInterval.end, "yyyy-MM-dd'T'HH:mm") : ""}
          onChange={e => setNewInterval({ ...newInterval, end: e.target.value ? parseISO(e.target.value) : null })}
        />
      </label>
      <button onClick={handleAddInterval}>Add Interval</button>
    </div>
  );
}

export default TaskIntervals;