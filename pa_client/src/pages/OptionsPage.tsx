import { useState } from "react";
import Header from "../components/Header"
import Modal from "../components/Modal";
import { ModalType } from "../utility/types";

function Option() {
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  return (
    <div className="page option-page">
      <Header />
      <h1>Options</h1>
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
      </div>
    </div>
  )
}

export default Option
