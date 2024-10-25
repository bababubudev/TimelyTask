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

  const onCardClicked = (id: number) => {
    setIsEditorOpen(true);

    if (id < -1) return;
    if (id < 0) {
      setSelectedTask({ ...emptyTask, name: "" });
      return;
    }

    const cardDetails: task = tasks.filter(elem => elem.id === id)[0];
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
                  Task name
                  <input
                    type="text"
                    id="task-name"
                    value={selectedTask.name}
                    onChange={e => {
                      const value = e.target.value;
                      setSelectedTask({ ...selectedTask, name: value });
                    }}
                  />
                </label>
                <br />
                <label htmlFor="task-tags">
                  Tags
                  <input
                    type="text"
                    id="task-tags"
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
