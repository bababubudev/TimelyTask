import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useData } from "../context/DataContext";
import { useEffect, useState } from "react";
import { task } from "../utility/types";
import { mapIDsToNames } from "../utility/tagMapping";
import TaskCard from "../components/TaskCard";

function TaskPage() {
  const { id } = useParams<{ id: string }>();
  const emptyTask: task = {
    id: -1,
    name: "Add new task",
    tags: "",
  };

  const [selectedTask, setSelectedTask] = useState<task>(emptyTask);
  const [currentTask, setCurrentTask] = useState<task[]>([]);

  const {
    tasks,
    tagMap,

    activeTasks,
    toggleActiveTask,

    optionLoading,
    optionError
  } = useData();

  console.log(id);

  useEffect(() => {
    if (id) {
      const task = tasks.find(t => t.id === parseInt(id));
      if (task) {
        setSelectedTask(task);
      }
    } else {
      const activeTaskId = tasks.filter(t => activeTasks[t.id]);
      setCurrentTask(activeTaskId);
      if (activeTaskId.length > 0) {
        setSelectedTask(activeTaskId[0]);
      }
    }
  }, [id, tasks, activeTasks]);

  return (
    <div className="page task-page">
      <Header />
      <div className="page-header">
        <h1>{selectedTask.name}</h1>
      </div>
      <div className="content task-content">
        {id ? (
          selectedTask.id !== -1 && (
            <TaskCard
              taskId={selectedTask.id}
              taskTitle={selectedTask.name}
              taskTags={mapIDsToNames(selectedTask.tags, tagMap)}
              onCardClicked={() => { }}
              isTaskActive={activeTasks[selectedTask.id]}
              toggleTaskActiveState={toggleActiveTask}
            />
          )
        ) :
          (
            currentTask.map(task => (
              <TaskCard
                key={task.id}
                taskId={task.id}
                taskTitle={task.name}
                taskTags={mapIDsToNames(task.tags, tagMap)}
                onCardClicked={() => { }}
                isTaskActive={activeTasks[task.id]}
                toggleTaskActiveState={toggleActiveTask}
              />
            ))
          )}
        {optionLoading && <div className="loading-spinner">Loading...</div>}
        {optionError && <p className="error-message">{(optionError as Error).message}</p>}
      </div>
    </div>
  );
}

export default TaskPage;