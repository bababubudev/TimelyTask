import { ChangeEvent, useState } from "react";
import { mappedTag, task } from "../utility/types";
import { mapIDsToNames, mapNamesToIds } from "../utility/tagMapping";

interface TaskFormProp {
  tagMap: mappedTag;
  selectedTask: task;
  setSelectedTask: (currentTask: task) => void;
}

function TaskForm({ tagMap, selectedTask, setSelectedTask }: TaskFormProp) {
  const [tagInput, setTagInput] = useState<string>("");

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
      setSelectedTask({ ...selectedTask, tags: updatedTags });
    }

    setTagInput("");
  }

  return (
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
  );
}

export default TaskForm;