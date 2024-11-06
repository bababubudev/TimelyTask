import { useCallback, useEffect, useState } from "react";
import Header from "../components/Header"
import TaskCard from "../components/TaskCard";
import TagFilter from "../components/TagFilter";
import { mapIDsToNames } from "../utility/tagMapping";
import { FilterType, ModalType } from "../utility/types";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";

import type { task } from "../utility/types";
import { useData } from "../context/DataContext";
import { findDataWithID, isEqual, isNewData } from "../utility/utilityComponent";
import Modal from "../components/Modal";
import TaskForm from "../components/TaskForm";

function TaskPage() {
  const {
    tasks,
    setAllTask,
    setTaskAdd,
    setTaskDelete,
    setTaskEdit,

    tagMap,
    setTagDeletion,
    setTagAddition,

    activeTasks,
    toggleActiveTask,

    optionLoading,
    optionError
  } = useData();

  const emptyTask: task = {
    id: -1,
    name: "Add a task",
    tags: "",
  };

  const defError = "Something went wrong :/";
  const [filteredTasks, setFilteredTasks] = useState<task[]>([]);
  const [draggedTask, setDraggedTask] = useState<task | undefined>(undefined);

  const [currentTask, setCurrentTask] = useState<task>(emptyTask);
  const [error, setError] = useState<Error | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const isEditTaskDisabled = currentTask.name === "" ||
    (currentTask.id > -1 && !isNewData<task>(tasks, currentTask));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("modal-overlay")) {
        if (isEditorOpen) setIsEditorOpen(false);
        if (isAlertOpen) setIsAlertOpen(false);
      }
    };

    document.addEventListener("mousedown", handleGlobalClick);

    return () => {
      document.removeEventListener("mousedown", handleGlobalClick);
    };
  }, [isEditorOpen, isAlertOpen]);

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => e.preventDefault();

    if (draggedTask) {
      document.addEventListener("touchmove", preventDefault, { passive: false });
    }
    else {
      document.removeEventListener("touchmove", preventDefault);
    }

    return () => {
      document.removeEventListener("touchmove", preventDefault);
    };
  }, [draggedTask]);

  const handleDragStart = (event: DragStartEvent): void => {
    const { active } = event;
    setDraggedTask(tasks.find(task => task.id === active.id));
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setDraggedTask(undefined);
      return;
    }

    const activeIndex = tasks.findIndex(task => task.id === active.id);
    const overIndex = tasks.findIndex(task => task.id === over.id);

    if (activeIndex === -1 || overIndex === -1) {
      setDraggedTask(undefined);
      return;
    }

    const updatedTasks = arrayMove(tasks, activeIndex, overIndex);

    setAllTask(updatedTasks);
    setDraggedTask(undefined);
  };

  const handleDragCancel = () => setDraggedTask(undefined);

  const onCardClicked = (id: number) => {
    setIsEditorOpen(true);
    if (id < -1) {
      setError(new Error(defError))
      return;
    }

    const cardDetails: task = tasks.find(elem => elem.id === id) || { ...emptyTask, name: "" };
    setCurrentTask(cardDetails);
  };

  const handleTaskSubmission = (id: number) => {
    setIsEditorOpen(false);
    if (currentTask.name === "" || (id > -1 && !isNewData<task>(tasks, currentTask))) {
      setError(new Error("Input was invalid or unchanged"));
      console.log("Invalid input");
      return;
    }

    if (id < -1) {
      setError(new Error(defError));
      return;
    }
    else if (id === -1) {
      setTaskAdd(currentTask);
    }
    else {
      const current = findDataWithID<task>(tasks, id);

      if (!current) {
        setError(new Error(defError));
        return;
      }

      if (isEqual<task>(current, currentTask)) {
        setError(new Error("Data did not change"));
        return;
      };

      setTaskEdit(currentTask);
      console.log("editing task", currentTask);
    }
  };

  const handleDeleteSubmission = (id: number) => {
    setIsAlertOpen(false);
    setIsEditorOpen(false);

    if (id < -1) {
      setError(new Error(defError));
      return;
    }

    setTaskDelete(id);
  }

  const onFilterChange = useCallback((chosenTags: string[], type: FilterType) => {
    const tagFilters: task[] = tasks.filter((task) => {
      const tagArray = task.tags.split(",");
      if (type === FilterType.AND) {
        return chosenTags.length === 0 || chosenTags.every(tag => tagArray.includes(tag));
      }
      else {
        return chosenTags.length === 0 || chosenTags.some(tag => tagArray.includes(tag));
      }
    });

    setFilteredTasks(tagFilters);
  }, [tasks]);

  return (
    <div className="page task-page">
      <Header />
      <div className="page-header">
        <h1>Tasks</h1>
        <TagFilter
          tagMap={tagMap}
          onFilterChange={onFilterChange}
        />
      </div>
      <div className="content task-content">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <ul className="tasks-display">
            <TaskCard
              isAdderTag={true}
              taskId={emptyTask.id}
              taskTitle={emptyTask.name}
              taskTags={[""]}
              onCardClicked={onCardClicked}
              toggleTaskActiveState={() => { }}
            />
            {filteredTasks.length > 0 || tasks.length > 0 ?
              <SortableContext
                items={tasks.map(task => task.id)}
              >
                {filteredTasks.map((elem, i) => (
                  <TaskCard
                    key={i}
                    taskId={elem.id}
                    taskTitle={elem.name}
                    isTaskActive={activeTasks[elem.id]}
                    taskTags={mapIDsToNames(elem.tags, tagMap)}
                    onCardClicked={(id) => onCardClicked(id)}
                    toggleTaskActiveState={toggleActiveTask}
                  />
                ))}
              </SortableContext> :
              <div className="is-empty-filter">
                <p>No tasks found</p>
              </div>
            }
          </ul>
          <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
            {draggedTask ? (
              <TaskCard
                taskId={draggedTask.id}
                taskTitle={draggedTask.name}
                taskTags={mapIDsToNames(draggedTask.tags, tagMap)}
                isTaskActive={activeTasks[draggedTask.id]}
                onCardClicked={() => { }}
                toggleTaskActiveState={toggleActiveTask}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
        {currentTask.id > -2 &&
          <Modal
            isDisabled={isEditTaskDisabled}
            type={ModalType.form}
            isOpen={isEditorOpen}
            dialogue={currentTask.id >= 0 ? "Edit task" : "Add a task"}
            description={
              <TaskForm
                isDisabled={isEditTaskDisabled}
                tagMap={tagMap}
                selectedTask={currentTask}
                createTag={setTagAddition}
                setSelectedTask={setCurrentTask}
                handleTaskSubmission={handleTaskSubmission}
                removeTagWithID={setTagDeletion}
                removeSelectedTask={() => setIsAlertOpen(true)}
              />
            }
            onConfirm={() => handleTaskSubmission(currentTask.id)}
            onCancel={() => setIsEditorOpen(false)}
            zIndex={10}
          />
        }
        <Modal
          type={ModalType.alert}
          dialogue="Delete task?"
          isOpen={isAlertOpen}
          description={<p>Are you sure you want to delete task <b>{currentTask.name}</b>?</p>}
          onConfirm={() => handleDeleteSubmission(currentTask.id)}
          onCancel={() => setIsAlertOpen(false)}
          zIndex={20}
        />
        {optionLoading && <div className="loading-spinner">Loading...</div>}
        {(error || optionError) && <p className="error-message">{((optionError || error) as Error).message}</p>}
      </div>
    </div>
  );
}

export default TaskPage;

