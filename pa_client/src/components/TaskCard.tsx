import type { tag } from "../utility/types";

interface TaskCardProps {
  isAdderTag?: boolean;
  currentTask: tag;
  taskTags: string[];
  onCardClicked: (id: number) => void;
}

function TaskCard({ isAdderTag = false, currentTask, taskTags, onCardClicked }: TaskCardProps) {

  return (
    <div
      className={`task-card ${isAdderTag ? "adder-tag" : ""}`}
      onClick={() => onCardClicked(currentTask.id)}
    >
      <h2 className="task-name">{currentTask.name}</h2>
      <div className="tag-list">
        {taskTags && taskTags.map((elem, i) => (
          <span key={i} className={`tag-name ${elem === "important" ? "imp" : ""}`}>{elem}</span>
        ))}
      </div>
      {isAdderTag &&
        <button className="add-tag">
          <span>+</span>
        </button>
      }
    </div>
  );
}

export default TaskCard;