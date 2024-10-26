import { useEffect, useState } from "react";
import Header from "../components/Header"
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import { mapIDsToNames } from "../utility/tagMapping";
import { ModalType, type mappedTag, type tag, type task } from "../utility/types";
import TaskForm from "../components/TaskForm";

function Task() {
  const BASE_URL = "http://127.0.0.1:3010";

  const emptyTask: task = {
    id: -1,
    name: "Add new task",
    tags: ""
  };

  const [tasks, setTasks] = useState<task[]>([]);
  const [tagMap, setTagMap] = useState<mappedTag>({});
  const [selectedTask, setSelectedTask] = useState<task>(emptyTask);

  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

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

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const tasksResponse = await fetch(`${BASE_URL}/tasks`, { method: "GET" });
      const tasksJson: task[] = await tasksResponse.json();

      const tagsResponse = await fetch(`${BASE_URL}/tags`, { method: "GET" });
      const tagsJson: tag[] = await tagsResponse.json();

      const tagMap: mappedTag = {};
      tagsJson.forEach(elem => { tagMap[elem.id] = elem.name });

      setTasks(tasksJson);
      setTagMap(tagMap);
    }
    catch (err) {
      setError(new Error("Something went wrong :/"));
      console.log(err);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const addTask = async (content: task) => {
    const { name, tags } = content;

    try {
      setLoading(true);
      setError(null);

      const postResponse = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tags })
      });

      const { id } = await postResponse.json();
      setTasks((prev) => [...prev, { id, name, tags }]);
    }
    catch (err) {
      setError(new Error("Adding task failed"));
      console.log("[ Adding task failed ]\n", err);
    }
    finally {
      setLoading(false);
    }
  }

  const editTask = async (updatedTask: task) => {
    const { id, name, tags } = updatedTask;

    try {
      setLoading(true);
      setError(null);

      await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tags })
      });

      setTasks(prev =>
        prev.map(elem => (elem.id === id ? updatedTask : elem))
      );
    }
    catch (err) {
      console.log("[ Editing task failed ]\n", err);
      setError(new Error("Editing task failed"));
    }
    finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    setIsAlertOpen(false);
    setIsAlertOpen(false);

    try {
      setLoading(true);
      await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });

      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
    catch (err) {
      console.log("[ Deleting task failed ]\n", err);
      setError(new Error("Deleting task failed"));
    }
    finally {
      setLoading(false);
    }
  };

  const onCardClicked = (id: number) => {
    console.log(isEditorOpen);

    setIsEditorOpen(true);
    if (id < -1) {
      setError(new Error("Something went wrong :/"))
      return;
    }

    const cardDetails: task = tasks.find(elem => elem.id === id) || { ...emptyTask, name: "" };
    setSelectedTask(cardDetails);
  };

  const handleOnConfirm = (id: number) => {
    setIsEditorOpen(false);
    if (selectedTask.name === "" || selectedTask.tags === "") {
      setError(new Error("Input was invalid"));
      console.log("Invalid input");
      return;
    }

    if (id < -1) {
      setError(new Error("Something went wrong :/"))
      return;
    }
    else if (id === -1) {
      addTask(selectedTask);
      console.log("adding task", selectedTask);
    }
    else {
      editTask(selectedTask);
      console.log("editing task", selectedTask);
    }
  };

  return (
    <div className="page task-page">
      <Header />
      <h1>Tasks</h1>
      <div className="content task-content">
        <ul className="tasks-display">
          {tasks.length > 0 && tasks.map(elem => (
            <TaskCard
              key={elem.id}
              currentTask={elem}
              taskTags={mapIDsToNames(elem.tags, tagMap)}
              onCardClicked={(id) => { onCardClicked(id); console.log(id); }}
            />
          ))}
          <TaskCard
            isAdderTag={true}
            currentTask={emptyTask}
            taskTags={[""]}
            onCardClicked={onCardClicked}
          />
        </ul>
        {selectedTask.id > -2 &&
          <Modal
            isDisabled={selectedTask.name === "" || selectedTask.tags === ""}
            type={ModalType.form}
            isOpen={isEditorOpen}
            dialogue={selectedTask.id >= 0 ? "Edit task" : "Add a task"}
            description={
              <TaskForm
                tagMap={tagMap}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
                removeSelectedTask={() => setIsAlertOpen(true)}
              />
            }
            onConfirm={() => handleOnConfirm(selectedTask.id)}
            onCancel={() => setIsEditorOpen(false)}
            zIndex={10}
          />
        }
        <Modal
          type={ModalType.alert}
          dialogue="Delete task?"
          isOpen={isAlertOpen}
          description={`Are you sure you want to delete task ${selectedTask.name}?`}
          onConfirm={() => deleteTask(selectedTask.id)}
          onCancel={() => setIsAlertOpen(false)}
          zIndex={20}
        />
        {loading && <div className="loading-spinner">Loading...</div>}
        {error && <p className="error-message">{(error as Error).message}</p>}
      </div>
    </div>
  )
}

export default Task;
