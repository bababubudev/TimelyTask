import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";

interface TaskCardProps {
  isAdderTag?: boolean;
  isOverlay?: boolean;
  taskId: number;
  taskTitle: string;
  taskTags: string[];
  onCardClicked: (id: number) => void;
}

function TaskCard({ isOverlay = false, isAdderTag = false, taskId, taskTitle, taskTags, onCardClicked }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: taskId });

  const style = {
    transition: isAdderTag ? undefined : transition,
    transform: isAdderTag ? undefined : CSS.Transform.toString(transform),
    opacity: isDragging ? 0.6 : 1,
  };

  const draggableStyles = {
    cursor: isDragging || isOverlay ? "grabbing" : "grab",
  };

  return (
    <div
      className={`task-card ${isAdderTag ? "adder-tag" : ""}`}
      onClick={() => onCardClicked(taskId)}
      ref={isAdderTag ? null : setNodeRef}
      style={style}
    >
      <h2 className="task-name">{taskTitle}</h2>
      <div className="tag-list">
        {taskTags && taskTags.map((elem, i) => (
          <span
            key={i}
            className={`tag-name ${elem === "important" ? "imp" : ""}`}
          >
            {elem}
          </span>
        ))}
      </div>
      {isAdderTag &&
        <button className="add-tag">
          <span>+</span>
        </button>
      }
      {!isAdderTag &&
        <div
          ref={setActivatorNodeRef}
          className="drag-handle"
          {...listeners}
          {...attributes}
          style={draggableStyles}
        >
          <MdDragIndicator />
        </div>
      }
    </div>
  );
}

export default TaskCard;