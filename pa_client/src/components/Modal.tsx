import { useEffect, useRef } from "react";
import { ModalType } from "../utility/types";

interface ModalProps {
  zIndex?: number;
  type?: ModalType;
  isChild?: boolean;
  isDisabled?: boolean;
  isOpen: boolean;
  dialogue: string;
  description?: string | JSX.Element;
  onConfirm: () => void;
  onCancel: () => void;
}

function Modal({
  zIndex = 1,
  type = ModalType.info,
  isChild = false,
  isDisabled,
  dialogue,
  description,
  isOpen,
  onConfirm,
  onCancel
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onCancel]);

  const parentElement = (child: JSX.Element): JSX.Element => {
    return isChild ? (
      <div
        ref={modalRef}
        className={`child-form modal-content ${isOpen ? "visible" : "hidden"}`}
        onSubmit={e => e.preventDefault()}
      >
        {child}
      </div>
    ) : (
      <form
        ref={formRef}
        className={`form modal-content ${isOpen ? "visible" : "hidden"}`}
        onSubmit={e => e.preventDefault()}
      >
        {child}
      </form>
    )
  }

  const formType: JSX.Element = (
    parentElement(
      <>
        <h1>{dialogue}</h1>
        <div className="description">
          {description}
        </div>
        {isChild ? null :
          <div className="modal-buttons">
            <button
              onClick={e => { e.stopPropagation(); onConfirm(); }}
              className="confirm-btn"
              type="submit"
              disabled={isDisabled}
            >
              Submit
            </button>
            <button
              onClick={e => { e.stopPropagation(); onCancel(); }}
              className="cancel-btn"
              type="button"
            >
              Cancel
            </button>
          </div>
        }
      </>
    )
  );

  const infoType: JSX.Element = (
    <div ref={zIndex > 1 ? null : modalRef} className={`info modal-content ${isOpen ? "visible" : "hidden"}`}>
      <h1>{dialogue}</h1>
      <div className="description">
        {description}
      </div>
      <div className="modal-buttons">
        <button
          onClick={e => { e.stopPropagation(); onCancel(); }}
          className="cancel-btn"
        >
          Done
        </button>
      </div>
    </div>
  );

  const alertType: JSX.Element = (
    <div ref={zIndex > 1 ? null : modalRef} className={`alert modal-content ${isOpen ? "visible" : "hidden"}`}>
      <h1>{dialogue}</h1>
      <div className="description">
        {description}
      </div>
      <div className="modal-buttons">
        <button
          onClick={e => { e.stopPropagation(); onConfirm(); }}
          className="confirm-btn"
          type="button"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="cancel-btn"
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderContent = (): JSX.Element => {
    switch (type) {
      case ModalType.alert:
        return alertType;
      case ModalType.info:
        return infoType;
      case ModalType.form:
        return formType;
      default:
        return (
          <>
            <h1>Something went wrong :/</h1>
            <button onClick={onCancel}>Okay</button>
          </>
        )
    }
  }

  return (
    <div
      className={`modal-overlay ${isOpen ? "visible" : "hidden"}`}
      style={{ zIndex }}
    >
      {renderContent()}
    </div >
  );
}

export default Modal;