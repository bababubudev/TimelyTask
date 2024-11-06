import { useState } from "react";
import Header from "../components/Header"
import Modal from "../components/Modal";
import { ModalType, ThemeType } from "../utility/types";
import { useData } from "../context/DataContext";
import TagForm from "../components/TagForm";

function Option() {
  const {
    options,
    setOptions,
    tagMap,
    setTagAddition,
    setTagDeletion,
    optionLoading,
    optionError
  } = useData();

  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isTagFormOpen, setIsTagFormOpen] = useState<boolean>(false);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = e.target.value as ThemeType;
    setOptions({ theme: theme });
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const alternative = e.target.checked ? 1 : 0;
    setOptions({ alternative: alternative });
  };


  return (
    <div className="page option-page">
      <Header />
      <div className="page-header">
        <h1>Options</h1>
      </div>
      <div className="content option-content">
        <button onClick={() => setIsAboutOpen(prev => !prev)}>Information</button>
        <Modal
          type={ModalType.info}
          dialogue="Info"
          description={
            <>
              <h2>Author: Prabesh Sharma</h2>
              <br />
              <h2>Instructions:</h2>
              <div className="instructions" style={{ marginLeft: "2rem" }}>
                <ul>
                  <li>you can change views from top of the app</li>
                  <li>to add new task click on add task with + icon on it</li>
                  <li>In order to add tags to a task, <b>IN FIREFOX</b> double click on the input box to make it show suggestions. (PART OF THE DATASET)</li>
                  <li>on the task page it is possible to edit an existing task by pressing on the edit button situated on the top left side of the corresponding task</li>
                  <li>to delete a task click on the <b>edit</b> button on the top right corner of the corresponding task card</li>
                  <li>activating and deactivating task requires you to simply click on the <b>"inactive"</b> button on the corresponding task</li>
                  <li>details on the task activity can be seen by clicking on the <b>details</b> button beside the "inactive" button</li>
                  <li><b>task</b> page contains filter for filtering with either <b>all</b> of the chosen tags or <b>any</b> of the chosen tags</li>
                  <li>to add or remove a tag, simply go to either settings and choose <b>modify tags</b> or click on an existing task and click <b>modify tags</b> button on the bottom</li>
                  <li><b>details</b> page has modifiable time ranges that which allows user to see from the selected range all the activated tasks</li>
                  <li><b>DUE TO ISSUES WITH FETCHING</b> please press the reload button situated on the top right section of <b>details</b> page to see latest changes</li>
                </ul>
              </div>
              <br />
              <h2>
                References/Sources
              </h2>
              <ul style={{ marginLeft: "2rem" }}>
                <li>ChatGPT was used to figure out many of the issues I ran into eg. timezone issues</li>
              </ul>
              <h2>Working hours <b>[46h]</b></h2>
              <h2>Most difficult</h2>
              <ul style={{ marginLeft: "2rem" }}>
                <li>Timezone issue made most of my code unuseable therefore a library had to be used</li>
                <li>I am not very good at styling</li>
              </ul>
            </>
          }
          isOpen={isAboutOpen}
          onConfirm={() => setIsAboutOpen(false)}
          onCancel={() => setIsAboutOpen(false)}
        />
        <button onClick={() => setIsTagFormOpen(prev => !prev)}>Modify tags</button>
        <TagForm
          isFormOpen={isTagFormOpen}
          tagMap={tagMap}
          addTag={setTagAddition}
          removeTagWithID={setTagDeletion}
          setIsFormOpen={setIsTagFormOpen}
        />
        <div className="theme-selector">
          <label htmlFor="theme">Theme</label>
          <select id="theme" value={options?.theme} onChange={handleThemeChange}>
            <option value={ThemeType.light}>Light</option>
            <option value={ThemeType.dark}>Dark</option>
            <option value={ThemeType.default}>Default</option>
          </select>
        </div>
        <div className="mode-selector">
          <label htmlFor="mode">Alternative Mode</label>
          <input
            type="checkbox"
            id="mode"
            checked={options?.alternative === 1}
            onChange={handleModeChange}
          />
        </div>
        {optionLoading && <div className="loading-spinner">Loading...</div>}
        {optionError && <p className="error-message">{(optionError as Error).message}</p>}
      </div>
    </div>
  )
}

export default Option
