import { useState } from "react";
import Header from "../components/Header"
import Modal from "../components/Modal";
import { ModalType, ThemeType } from "../utility/types";
import { useOptions } from "../context/OptionsContext";

function Option() {
  const { options, setOptions } = useOptions();
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

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
        <div>
          <p>Current Theme: {options?.theme ?? ThemeType.default}</p>
          <select value={options?.theme} onChange={handleThemeChange}>
            <option value={ThemeType.default}>Default</option>
            <option value={ThemeType.light}>Light</option>
            <option value={ThemeType.dark}>Dark</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Option
