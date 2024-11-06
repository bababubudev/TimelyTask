import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import { isFirefox } from "../utility/utilityComponent";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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
      onClick={() => { if (isAdderTag) onCardClicked(taskId); }}
      ref={isAdderTag ? null : setNodeRef}
      style={style}
    >
      <h2 className="task-name">{taskTitle}</h2>
      {!isAdderTag &&
        <div className={`timer-info ${isTaskActive ? "is-active" : ""}`}>
          <button onClick={(e) => { e.stopPropagation(); toggleTaskActiveState(taskId); }}>
            <p>{isTaskActive ? "Active" : "Inactive"}</p>
            <span>•</span>
          </button>
          <div className="interval-area">
            <button onClick={() => navigate(`summary/${taskId}`)}>
              <CgDetailsMore />
              <p>details</p>
            </button>
          </div>
        </div>
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
        <div className="task-modifiers">
          <div className="edit-task-btn">
            <button
              onClick={() => onCardClicked(taskId)}
            >
              <FaEdit />
              <p>edit</p>
            </button>
          </div>
          <div
            ref={setActivatorNodeRef}
            className="drag-handle"
            {...listeners}
            {...attributes}
            style={draggableStyles}
          >
            <MdDragIndicator />
          </div>
        </div>
      }
    </div>
  );
}

export default TaskCard;