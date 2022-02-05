import React, { useEffect, useRef } from "react";
import ReactDom from "react-dom";
import ClickOutside from "./ClickOutside";
import { useTransition, animated } from "react-spring";
import "./styles/modal.css";

function Modal({ open, close, children, classModal }) {
  const ref = useRef();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  // Transition modal

  const transitionModal = useTransition(open, {
    from: { transform: "translate(-50%, 0%)", top: "100%" },
    enter: { transform: "translate(-50%, -50%)", top: "50%", left: "50%" },
    leave: { transform: "translate(-50%, 0%)" },
  });

  ClickOutside(ref, close);

  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div>
        <div className="modal-overlay-style"></div>
        {transitionModal((style, item) =>
          item ? (
            <animated.div
              style={style}
              ref={ref}
              className={`modal-style ${classModal}`}
            >
              {children}
            </animated.div>
          ) : null
        )}
      </div>
      )
    </>,
    document.getElementById("portal")
  );
}

export default Modal;
