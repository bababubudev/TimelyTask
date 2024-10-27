import { ChangeEvent, useState } from "react";
import Modal from "./Modal";
import { mappedTag, ModalType } from "../utility/types";
import { IoInformationCircle } from "react-icons/io5";

interface TagModifyProp {
  tagMap: mappedTag;
  createTagForm: boolean;

  createTag: (name: string) => void;
  removeTagWithID: (id: number) => void;
  setCreateTagForm: (value: boolean) => void;
}

function TagForm({ createTagForm, tagMap, createTag, removeTagWithID, setCreateTagForm }: TagModifyProp) {
  const [tagInput, setTagInput] = useState<string>("");
  const [removalID, setRemovalID] = useState<number>(-2);
  const [removeTagAlert, setRemoveTagAlert] = useState<boolean>(false);

  const validAddition = !Object.values(tagMap)
    .includes(tagInput) &&
    tagInput !== "" &&
    tagInput.length >= 3;

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target.value;
    setTagInput(input);
  };

  const handleTagAddition = () => {
    if (!validAddition) { console.log("Invalid input"); return; }

    createTag(tagInput);
    setTagInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (createTagForm && !removeTagAlert) {
        handleTagAddition();
        return;
      }
    }
  };

  return (
    <Modal
      isDisabled={!validAddition}
      isChild={true}
      type={ModalType.info}
      isOpen={createTagForm}
      dialogue="Modify tags"
      description={
        <>
          <div className="name-area is-tag">
            <label
              className={`${tagInput !== "" ? "has-text" : ""}`}
              htmlFor="task-tags"
            >
              create new tag
            </label>
            <input
              type="text"
              autoComplete="off"
              value={tagInput}
              onChange={handleTagChange}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="add-tag-btn"
              disabled={!validAddition}
              onClick={handleTagAddition}
            >
              Add Tag
            </button>
          </div>
          <div className="all-tag-view">
            {Object.entries(tagMap).map(([key, val]) => (
              <span
                key={key}
                className="tag-chip"
                onClick={() => { setRemoveTagAlert(true); setRemovalID(Number(key)) }}
              >
                {val}
              </span>
            ))}
            <div className="info">
              <IoInformationCircle />
              <p> click on a tag to remove</p>
            </div>
          </div>
          <Modal
            zIndex={40}
            type={ModalType.alert}
            dialogue="Delete tag?"
            description={<p>Are you sure you want to delete <b>{tagMap[removalID]}</b>?</p>}
            isOpen={removeTagAlert}
            onConfirm={() => {
              if (removeTagAlert) removeTagWithID(removalID);
              setRemoveTagAlert(false);
            }}
            onCancel={() => setRemoveTagAlert(false)}
          />
        </>
      }
      onConfirm={() => { }}
      onCancel={() => { setCreateTagForm(false); setTagInput(""); }}
      zIndex={30}
    />
  );
}

export default TagForm;