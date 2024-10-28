import { useCallback, useEffect, useState } from "react";
import Header from "../components/Header"
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import { mapIDsToNames } from "../utility/tagMapping";
import { FilterType, ModalType, type mappedTag, type tag, type task } from "../utility/types";
import TaskForm from "../components/TaskForm";
import { findDataWithID, isEqual, isNewData } from "../utility/utilityFunctions";
import TagFilter from "../components/TagFilter";

function Task() {
  const BASE_URL = "http://127.0.0.1:3010";

  const emptyTask: task = {
    id: -1,
    name: "Add new task",
    tags: ""
  };

  const defError = "Something went wrong :/";

  const [tasks, setTasks] = useState<task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<task[]>([]);
  const [tagMap, setTagMap] = useState<mappedTag>({});

  const [selectedTask, setSelectedTask] = useState<task>(emptyTask);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const isEditTaskDisabled = selectedTask.name === "" ||
    (selectedTask.id > -1 && !isNewData<task>(tasks, selectedTask));

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
      setError(new Error(defError));
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
      console.log("adding task", { id, name, tags });
    }
    catch (err) {
      setError(new Error("Adding task failed"));
      console.log("[ Adding task failed ]\n", err);
    }
    finally {
      setLoading(false);
    }
  };

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
    console.log("deleting task", selectedTask);
    setIsAlertOpen(false);
    setIsEditorOpen(false);

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

  const addTag = async (tagName: string) => {
    console.log("adding new tag", tagName);

    const isExisting = Object.values(tagMap).includes(tagName);
    if (isExisting) return;

    try {
      setLoading(true);
      setError(null);

      console.log(tagName);

      const postResponse = await fetch(`${BASE_URL}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagName })
      });

      const { id } = await postResponse.json();
      setTagMap(prev => ({ ...prev, [id]: tagName }));
    }
    catch (err) {
      setError(new Error("Adding task failed"));
      console.log("[ Adding task failed ]\n", err);
    }
    finally {
      setLoading(false);
    }
  };

  const removeTag = async (id: number) => {
    console.log("deleting tag", tagMap[id]);

    try {
      setLoading(true);
      await fetch(`${BASE_URL}/tags/${id}`, { method: "DELETE" });

      setTagMap(prev => {
        const updatedEntries = Object.entries(prev).filter(([key]) => key !== id.toString());
        return Object.fromEntries(updatedEntries);
      });
    }
    catch (err) {
      console.log("[ Deleting task failed ]\n", err);
      setError(new Error("Deleting task failed"));
    }
    finally {
      setLoading(false);
    }
  }

  const onCardClicked = (id: number) => {
    setIsEditorOpen(true);
    if (id < -1) {
      setError(new Error(defError))
      return;
    }

    const cardDetails: task = tasks.find(elem => elem.id === id) || { ...emptyTask, name: "" };
    setSelectedTask(cardDetails);
  };

  const handleTaskSubmission = (id: number) => {
    setIsEditorOpen(false);
    if (selectedTask.name === "" || (id > -1 && !isNewData<task>(tasks, selectedTask))) {
      setError(new Error("Input was invalid or unchanged"));
      console.log("Invalid input");
      return;
    }

    if (id < -1) {
      setError(new Error(defError))
      return;
    }
    else if (id === -1) {
      addTask(selectedTask);
    }
    else {
      const current = findDataWithID<task>(tasks, id);

      if (!current) {
        setError(new Error(defError));
        return;
      }

      if (isEqual<task>(current, selectedTask)) {
        setError(new Error("Data did not change"));
        return;
      };

      editTask(selectedTask);
      console.log("editing task", selectedTask);
    }
  };

  const onFilterChange = useCallback((chosenTags: string[], type: FilterType) => {
    const tagFilters: task[] = tasks.filter((task) => {
      const tagArray = task.tags.split(",");
      if (type === "AND") {
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
      <div className="page-name">
        <h1>Tasks</h1>
        <TagFilter
          tagMap={tagMap}
          onFilterChange={onFilterChange}
        />
      </div>
      <div className="content task-content">
        <ul className="tasks-display">
          {filteredTasks.length > 0 && filteredTasks.map(elem => (
            <TaskCard
              key={elem.id}
              currentTask={elem}
              taskTags={mapIDsToNames(elem.tags, tagMap)}
              onCardClicked={(id) => onCardClicked(id)}
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
            isDisabled={isEditTaskDisabled}
            type={ModalType.form}
            isOpen={isEditorOpen}
            dialogue={selectedTask.id >= 0 ? "Edit task" : "Add a task"}
            description={
              <TaskForm
                isDisabled={isEditTaskDisabled}
                tagMap={tagMap}
                selectedTask={selectedTask}
                createTag={addTag}
                setSelectedTask={setSelectedTask}
                handleTaskSubmission={handleTaskSubmission}
                removeTagWithID={removeTag}
                removeSelectedTask={() => setIsAlertOpen(true)}
              />
            }
            onConfirm={() => handleTaskSubmission(selectedTask.id)}
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
