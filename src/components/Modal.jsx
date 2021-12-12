import React, { useRef } from "react";
import ReactDom from "react-dom";
import ClickOutside from "./ClickOutside";
import "./styles/modal.css";

function Modal({ open, close, children }) {
  const ref = useRef();

  ClickOutside(ref, close);

  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div>
        <div className="modal-overlay-style"></div>
        <div ref={ref} className="modal-style">
          {children}
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
}

export default Modal;
