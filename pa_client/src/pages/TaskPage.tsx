import { useEffect, useState } from "react";
import Header from "../components/Header"
import TaskCard from "../components/TaskCard";
import type { mappedTag, tag, task } from "../utility/types";
import Modal from "../components/Modal";

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

  useEffect(() => {
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
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const fetchSpecifiedData = async (id: number): Promise<task | void> => {
    if (id === -1) {
      return emptyTask;
    }

    try {
      const taskResponse = await fetch(`${BASE_URL}/tasks/${id}`, { method: "GET" });
      const taskJson: task[] = await taskResponse.json();

      return taskJson[0];
    }
    catch (err) {
      console.log(err);
      return { ...emptyTask, id: -2 };
    }
  }

  const onCardClicked = async (id: number) => {
    setIsEditorOpen(true);
    const cardDetails = await fetchSpecifiedData(id);

    if (typeof cardDetails !== "object") return;
    setSelectedTask(cardDetails);
  }

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
              taskTags={elem.tags}
              tagMap={tagMap}
              onCardClicked={onCardClicked}
            />
          ))}
          <TaskCard
            isAdderTag={true}
            currentTask={emptyTask}
            taskTags=""
            tagMap={{ 0: "" }}
            onCardClicked={onCardClicked}
          />
        </ul>
        {selectedTask.id > -2 &&
          <Modal
            isOpen={isEditorOpen}
            dialogue={selectedTask.id >= 0 ? "Edit" : "Add"}
            description={
              <form onSubmit={e => e.preventDefault()}>
                <label htmlFor="task-name">
                  <input
                    type="text"
                    value={selectedTask.name}
                    id="task-name"
                    onChange={e => {
                      const value = e.target.value;
                      setSelectedTask({ ...selectedTask, name: value });
                    }}
                  />
                </label>
                <label htmlFor="task-tags">
                  <input
                    type="text"
                    value={selectedTask.tags}
                    onChange={e => {
                      const value = e.target.value;
                      setSelectedTask({ ...selectedTask, id: Number(value) });
                    }}
                  />
                </label>
              </form>
            }
            onConfirm={() => setIsEditorOpen(false)}
            onCancel={() => setIsEditorOpen(false)}
          />
        }
      </div>
    </div>
  )
}

export default Task;
