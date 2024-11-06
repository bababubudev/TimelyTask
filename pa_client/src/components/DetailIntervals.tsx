import { format, parseISO } from "date-fns";
import { observationInterval } from "../utility/types";

interface DetailIntervalsProps {
  observationInterval: observationInterval;
  handleIntervalChange: (start: Date, end: Date) => void;
}

function DetailIntervals({ observationInterval, handleIntervalChange }: DetailIntervalsProps) {
  return (
    <div className="detail-intervals">
      <label>
        <p>Start time</p>
        <input
          type="datetime-local"
          value={format(observationInterval.start, "yyyy-MM-dd'T'HH:mm")}
          onChange={e => handleIntervalChange(parseISO(e.target.value), observationInterval.end)}
        />
      </label>
      <label>
        <p>End time</p>
        <input
          type="datetime-local"
          value={format(observationInterval.end, "yyyy-MM-dd'T'HH:mm")}
          onChange={e => handleIntervalChange(observationInterval.start, parseISO(e.target.value))}
        />
      </label>
    </div>
  );
}

export default DetailIntervals;