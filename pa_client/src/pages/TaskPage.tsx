import { useEffect, useState } from "react";
import Header from "../components/Header"
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import { mapIDsToNames } from "../utility/tagMapping";
import { modalType, type mappedTag, type tag, type task } from "../utility/types";
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

  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<task>(emptyTask);
  const maxKey = Math.max(...Object.keys(tagMap).map(key => Number(key)));

  const fetchData = async () => {
    try {
      const tasksResponse = await fetch(`${BASE_URL}/tasks`, { method: "GET" });
      const tasksJson: task[] = await tasksResponse.json();

      const tagsResponse = await fetch(`${BASE_URL}/tags`, { method: "GET" });
      const tagsJson: tag[] = await tagsResponse.json();

      const tagMap: mappedTag = {};
      tagsJson.forEach(elem => {
        tagMap[elem.id] = elem.name;
      });

      setTasks(tasksJson);
      setTagMap(tagMap);
    }
    catch (err) {
      //? Handle fetch error
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const postNewTask = async (content: task) => {
    try {
      const newContent = content.id === -1 ? { ...content, id: maxKey + 1 } : content;
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent),
      });

      const json = await response.json();

      setTasks(prev => [...prev, json]);
    } catch (err) {
      console.log(err);
    }
  }

  const onCardClicked = (id: number) => {
    setIsEditorOpen(true);
    if (id < -1) {
      //? Handle fetch error
      return;
    }

    const cardDetails: task = tasks.find(elem => elem.id === id) || { ...emptyTask, name: "" };
    setSelectedTask(cardDetails);
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
              onCardClicked={onCardClicked}
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
            type={modalType.form}
            isOpen={isEditorOpen}
            dialogue={selectedTask.id >= 0 ? "Edit task" : "Add a task"}
            description={
              <TaskForm
                tagMap={tagMap}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
              />
            }
            onConfirm={() => { setIsEditorOpen(false); postNewTask(selectedTask); }}
            onCancel={() => setIsEditorOpen(false)}
          />
        }
      </div>
    </div>
  )
}

export default Task;
