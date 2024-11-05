import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import { isFirefox } from "../utility/utilityComponent";

interface TaskCardProps {
  isAdderTag?: boolean;
  isOverlay?: boolean;
  isTaskActive?: boolean;
  taskId: number;
  taskTitle: string;
  taskTags: string[];
  onCardClicked: (id: number) => void;
  toggleTaskActiveState: (id: number) => void;
}

function TaskCard({
  isOverlay = false,
  isAdderTag = false,
  isTaskActive = false,
  taskId,
  taskTitle,
  taskTags,
  onCardClicked,
  toggleTaskActiveState,
}: TaskCardProps) {
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
    transition: transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.6 : 1,
  };

  const draggableStyles = {
    cursor: isDragging || isOverlay ? "grabbing" : "grab",
  };

  return (
    <div
      className={`
        task-card
        ${isAdderTag ? "adder-tag" : ""}
        ${isFirefox ? "firefox" : ""}
      `}
      onClick={() => onCardClicked(taskId)}
      ref={isAdderTag ? null : setNodeRef}
      style={style}
    >
      <h2 className="task-name">{taskTitle}</h2>
      {!isAdderTag &&
        <button
          onClick={(e) => { e.stopPropagation(); toggleTaskActiveState(taskId); }}
          className={`status-container ${isTaskActive ? "is-active" : ""}`}
        >
          <span>{isTaskActive ? "Active" : "Inactive"}</span>
          <span>•</span>
        </button>
      }
      <div className="tag-list">
        {taskTags && taskTags.length > 0 ?
          taskTags.map((elem, i) => (
            <span
              key={i}
              className={`tag-name ${elem === "important" ? "imp" : ""}`}
            >
              {elem}
            </span>
          )) :
          <span className="no-tag">...</span>
        }
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