import { ChangeEvent, useEffect, useState } from "react";
import Header from "../components/Header"
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import { mapIDsToNames, mapNamesToIds } from "../utility/tagMapping";
import type { mappedTag, tag, task } from "../utility/types";

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

  const [tagInput, setTagInput] = useState<string>("");

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
        //? Handle fetch error
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const onCardClicked = (id: number) => {
    setIsEditorOpen(true);
    if (id < -1) {
      //? Handle fetch error
      return;
    }

    const cardDetails: task = tasks.find(elem => elem.id === id) || { ...emptyTask, name: "" };
    setSelectedTask(cardDetails);
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setTagInput(input);


    const validTag = Object.values(tagMap).includes(input);
    if (validTag) handleTagSelect(input);
  }

  const handleTagSelect = (tagName: string) => {
    const tagId = mapNamesToIds([tagName], tagMap);

    //* inserts unique tags only
    if (!selectedTask.tags.split(",").includes(tagId)) {
      const updatedTags = selectedTask.tags ? `${selectedTask.tags},${tagId}` : tagId;
      setSelectedTask(prev => ({ ...prev, tags: updatedTags }));
    }

    setTagInput("");
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
            isOpen={isEditorOpen}
            dialogue={selectedTask.id >= 0 ? "Edit task" : "Add a task"}
            description={
              <form onSubmit={e => e.preventDefault()}>
                <label htmlFor="task-name">
                  Task name
                </label>
                <input
                  type="text"
                  id="task-name"
                  placeholder="Add task name"
                  value={selectedTask.name}
                  onChange={e => {
                    const value = e.target.value;
                    setSelectedTask({ ...selectedTask, name: value });
                  }}
                  required
                />
                <br />
                <label htmlFor="task-tags">
                  Tags
                </label>
                <input
                  type="text"
                  id="task-tags"
                  autoComplete="off"
                  placeholder="Add tags"
                  list="suggestions"
                  value={tagInput}
                  onChange={handleTagChange}
                />
                <datalist id="suggestions">
                  {Object.values(tagMap).map((elem, i) => (
                    <option key={i} value={elem}>{tagMap[elem]}</option>
                  ))}
                </datalist>
                <br />
                <div className="selected-tags">
                  {mapIDsToNames(selectedTask.tags, tagMap).map((tag, index) => (
                    <span key={index} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
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
