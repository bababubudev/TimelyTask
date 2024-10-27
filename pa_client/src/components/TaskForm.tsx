import { ChangeEvent, useRef, useState } from "react";
import { mappedTag, ModalType, task } from "../utility/types";
import { mapIDsToNames, mapNamesToIds } from "../utility/tagMapping";
import { FaAngleLeft } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import Modal from "./Modal";

interface TaskFormProp {
  tagMap: mappedTag;
  selectedTask: task;
  createTag: (name: string) => void;
  setSelectedTask: (currentTask: task) => void;
  removeSelectedTask: () => void;
}

function TaskForm({ tagMap, selectedTask, createTag, setSelectedTask, removeSelectedTask }: TaskFormProp) {
  const selectedTagsRef = useRef<HTMLDivElement>(null);
  const [tagInput, setTagInput] = useState<string>("");
  const [addAlert, setAddAlert] = useState<boolean>(false);

  const validAddition = !Object.values(tagMap)
    .includes(tagInput) &&
    tagInput !== "" &&
    tagInput.length >= 3;

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setTagInput(input);

    const validTag = Object.values(tagMap).includes(input);
    if (validTag) handleTagSelect(input);
  };

  const handleTagSelect = (tagName: string) => {
    const tagId = mapNamesToIds([tagName], tagMap);

    //* inserts unique tags only
    if (!selectedTask.tags.split(",").includes(tagId)) {
      const updatedTags = selectedTask.tags ? `${selectedTask.tags},${tagId}` : tagId;
      setSelectedTask({ ...selectedTask, tags: updatedTags });
    }

    setTagInput("");
  };

  const handleTagRemove = (tagName: string) => {
    const tagId = mapNamesToIds([tagName], tagMap);

    if (selectedTask.tags.split(",").includes(tagId)) {
      const updatedTags = selectedTask.tags
        .split(",")
        .filter(id => id !== tagId)
        .join(",");

      setSelectedTask({ ...selectedTask, tags: updatedTags });
    }
  };

  const handleTagAddition = () => {
    if (!validAddition) { console.log("Invalid input"); return; }

    createTag(tagInput);
    setAddAlert(false);
    setTagInput("");
  };

  const scrollLeft = () => {
    if (selectedTagsRef.current) {
      selectedTagsRef.current.scrollBy({
        left: -100,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (selectedTagsRef.current) {
      selectedTagsRef.current.scrollBy({
        left: 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="name-area">
        <label
          className={`${selectedTask.name !== "" ? "has-text" : ""}`}
          htmlFor="task-name">
          Task name
        </label>
        <input
          type="text"
          id="task-name"
          placeholder="Name of the task"
          value={selectedTask.name}
          autoComplete="off"
          onChange={e => {
            const value = e.target.value;
            setSelectedTask({ ...selectedTask, name: value });
          }}
          required
        />
      </div>
      <br />
      <div className="tag-area">
        <label
          className={`${tagInput !== "" ? "has-text" : ""}`}
          htmlFor="task-tags"
        >
          Tags
        </label>
        <input
          type="text"
          id="task-tags"
          autoComplete="off"
          placeholder="Choose existing or create tag"
          list="suggestions"
          value={tagInput}
          onChange={handleTagChange}
        />
        <datalist id="suggestions">
          {Object.values(tagMap).map((elem, i) => (
            <option key={i} value={elem}>{tagMap[elem]}</option>
          ))}
        </datalist>
      </div>
      <br />
      <div className="tag-btns">
        <button type="button" className="scroll-btn left" onClick={scrollLeft}>
          <FaAngleLeft />
        </button>
        <div className="selected-tags" ref={selectedTagsRef}>
          {mapIDsToNames(selectedTask.tags, tagMap).map((tag, index) => (
            <button
              key={index}
              type="button"
              className="tag-chip"
              onClick={() => handleTagRemove(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <button type="button" className="scroll-btn right" onClick={scrollRight}>
          <FaAngleLeft />
        </button>

        <button
          type="button"
          className="add-tag-btn"
          onClick={() => setAddAlert(true)}
          disabled={!validAddition}
        >
          create tag +
        </button>
      </div>
      {selectedTask.id >= 0 &&
        <button
          title="delete task"
          type="button"
          className="remove-btn"
          onClick={removeSelectedTask}
        >
          <AiFillDelete />
        </button>
      }
      {validAddition &&
        <Modal
          type={ModalType.alert}
          isOpen={addAlert}
          dialogue="Create tag?"
          description={`Are you sure you want to add tag: ${tagInput}?`}
          onConfirm={handleTagAddition}
          onCancel={() => setAddAlert(false)}
          zIndex={20}
        />
      }
    </>
  );
}

export default TaskForm;