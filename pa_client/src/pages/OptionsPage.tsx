import { useState } from "react";
import Header from "../components/Header"
import Modal from "../components/Modal";
import { ModalType, ThemeType } from "../utility/types";
import { useOptions } from "../context/OptionsContext";
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
  } = useOptions();
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isTagFormOpen, setIsTagFormOpen] = useState<boolean>(false);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = e.target.value as ThemeType;
    setOptions({ theme: theme });
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
                </ul>
              </div>
              <br />
              <h2>References/Sources</h2>
              <h2>Working hours [5hr]</h2>
              <h2>Most difficult</h2>
            </>
          }
          isOpen={isAboutOpen}
          onConfirm={() => setIsAboutOpen(false)}
          onCancel={() => setIsAboutOpen(false)}
        />
        <button onClick={() => setIsTagFormOpen(prev => !prev)}>Tags</button>
        <TagForm
          isFormOpen={isTagFormOpen}
          tagMap={tagMap}
          addTag={setTagAddition}
          removeTagWithID={setTagDeletion}
          setIsFormOpen={setIsTagFormOpen}
        />
        <div>
          <p>Current Theme: {options?.theme ?? ThemeType.default}</p>
          <select value={options?.theme} onChange={handleThemeChange}>
            <option value={ThemeType.default}>Default</option>
            <option value={ThemeType.light}>Light</option>
            <option value={ThemeType.dark}>Dark</option>
          </select>
        </div>
        {optionLoading && <div className="loading-spinner">Loading...</div>}
        {optionError && <p className="error-message">{(optionError as Error).message}</p>}
      </div>
    </div>
  )
}

export default Option
