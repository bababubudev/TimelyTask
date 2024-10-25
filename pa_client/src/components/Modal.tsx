import { useEffect, useRef } from "react";
import { modalType } from "../utility/types";

interface ModalProps {
  type?: modalType
  isOpen: boolean;
  dialogue: string;
  description?: string | JSX.Element;
  onConfirm: () => void;
  onCancel: () => void;
}

function Modal({ type = modalType.alert, dialogue, description, isOpen, onConfirm, onCancel }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const isInfo = type === modalType.info;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onCancel]);

  return (
    <div className={`modal-overlay ${isOpen ? "visible" : "hidden"} ${isInfo ? "info-pnl" : ""}`}>
      <div ref={modalRef} className={`modal-content ${isOpen ? "visible" : "hidden"}`}>
        <h1>{dialogue}</h1>
        <div className="description">
          {typeof description === "string"
            ? <p>{description}</p>
            : description
          }
        </div>
        <div className="modal-buttons">
          {!isInfo &&
            <button
              onClick={(e) => { e.stopPropagation(); onConfirm() }}
              className="confirm-btn"
            >
              Confirm
            </button>
          }
          <button
            onClick={(e) => { e.stopPropagation(); onCancel() }}
            className="cancel-btn"
          >
            {isInfo ? "Got it" : "Cancel"}
          </button>
        </div>
      </div>
    </div >
  );
}

export default Modal;