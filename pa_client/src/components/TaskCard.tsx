import type { mappedTag, tag } from "../utility/types";

interface TaskCardProps {
  isAdderTag?: boolean;
  currentTask: tag;
  taskTags: string;
  tagMap: mappedTag;
  onCardClicked: (id: number) => void;
}

function TaskCard({ isAdderTag = false, currentTask, taskTags, tagMap, onCardClicked }: TaskCardProps) {
  const matchedTag = taskTags.split(",").map(elem => tagMap[elem]);

  return (
    <div
      className={`task-card ${isAdderTag ? "adder-tag" : ""}`}
      onClick={() => onCardClicked(currentTask.id)}
    >
      <h2 className="task-name">{currentTask.name}</h2>
      <div className="tag-list">
        {matchedTag && matchedTag.map((elem, i) => (
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