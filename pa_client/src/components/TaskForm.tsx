import { ChangeEvent, useEffect, useRef, useState } from "react";
import { mappedTag, task } from "../utility/types";
import { mapIDsToNames, mapNamesToIds } from "../utility/tagMapping";
import { FaAngleLeft } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import TagForm from "./TagForm";
import { IoInformationCircle } from "react-icons/io5";

interface TaskFormProp {
  isDisabled: boolean;
  tagMap: mappedTag;
  selectedTask: task;
  createTag: (name: string) => void;
  setSelectedTask: (currentTask: task) => void;
  handleTaskSubmission: (id: number) => void;
  removeTagWithID: (id: number) => void;
  removeSelectedTask: () => void;
}

function TaskForm({ isDisabled, tagMap, selectedTask, createTag, setSelectedTask, handleTaskSubmission, removeSelectedTask, removeTagWithID }: TaskFormProp) {
  const selectedTagsRef = useRef<HTMLDivElement>(null);

  const [tagInput, setTagInput] = useState<string>("");
  const [createTagForm, setCreateTagForm] = useState<boolean>(false);
  const [removeTagAlert, setRemoveAlert] = useState<boolean>(false);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (createTagForm || isDisabled) {
        return;
      }

      handleTaskSubmission(selectedTask.id);
    }
  };

  const scrollLeft = () => {
    if (selectedTagsRef.current) {
      selectedTagsRef.current.scrollBy({
        left: -100,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (amt = 100) => {
    if (selectedTagsRef.current) {
      selectedTagsRef.current.scrollBy({
        left: amt,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("modal-overlay")) {
        if (createTagForm) setCreateTagForm(false);
        if (removeTagAlert) setRemoveAlert(false);
      }
    };

    document.addEventListener("mousedown", handleGlobalClick);

    return () => {
      document.removeEventListener("mousedown", handleGlobalClick);
    };
  }, [createTagForm, removeTagAlert]);

  useEffect(() => {
    scrollRight(1920);
  }, []);

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
          onKeyDown={handleKeyDown}
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
          placeholder="Choose a tag"
          list="suggestions"
          value={tagInput}
          onChange={handleTagChange}
          onKeyDown={handleKeyDown}
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
        {selectedTask.tags.length > 0 &&
          <div className="selected-tags-info">
            <IoInformationCircle />
            <p>click on a tag to remove</p>
          </div>
        }
        <div className="selected-tags" ref={selectedTagsRef}>
          {mapIDsToNames(selectedTask.tags, tagMap).map((tag, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleTagRemove(tag)}
            >
              {tag}
            </button>
          ))}
          {selectedTask.tags.length === 0 && <p>chosen tasks show up here</p>}
        </div>
        <button type="button" className="scroll-btn right" onClick={() => scrollRight()}>
          <FaAngleLeft />
        </button>
        <button
          type="button"
          className="modify-tag-btn"
          onClick={() => setCreateTagForm(true)}
        >
          modify tags
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
      {/* Modal for modifying tags*/}
      <TagForm
        createTagForm={createTagForm}
        tagMap={tagMap}
        createTag={createTag}
        removeTagWithID={removeTagWithID}
        setCreateTagForm={setCreateTagForm}
      />
    </>
  );
}

export default TaskForm;