import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import "./styles/snackbarCart.css";
import ReactDom from "react-dom";
import Header from "./Header";
import asset from "./../assets";
import ClickOutside from "./ClickOutside";

import { useTransition, animated } from "react-spring";
import { useState } from "react";

const SnackbarCart = forwardRef(({ children }, ref) => {
  const [handleSnackbar, setHandleSnackbar] = useState(false);

  const outsideRef = useRef();

  ClickOutside(outsideRef, () => setHandleSnackbar(false));

  useEffect(() => {
    if (handleSnackbar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [handleSnackbar]);

  useImperativeHandle(ref, () => {
    return {
      showSnackbar: () => {
        setHandleSnackbar(true);

        setTimeout(() => {
          setHandleSnackbar(false);
        }, 5000);
      },
    };
  });

  const transition = useTransition(handleSnackbar, {
    from: { opacity: "0", cursorEvents: "none", top: "0" },
    enter: { opacity: "1", cursorEvents: "all", top: "160px" },
    leave: { opacity: "0", cursorEvents: "none" },
  });

  if (!handleSnackbar) return null;

  return ReactDom.createPortal(
    <>
      <div>
        <div className="modal-overlay-style"></div>
        {transition((style, item) =>
          item ? (
            <>
              <div className="snackbar-cart-header">
                <Header />
              </div>
              <animated.div
                ref={outsideRef}
                style={style}
                className="snackbar-cart p-3"
              >
                {children}
              </animated.div>
            </>
          ) : null
        )}
      </div>
      )
    </>,
    document.getElementById("portal")
  );
});

export default SnackbarCart;
