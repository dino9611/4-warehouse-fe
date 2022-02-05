import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./styles/snackbarMessage.css";
import images from "./../assets";
import { animated, useTransition } from "react-spring";

const SnackbarMessage = forwardRef(({ status, message }, ref) => {
  const [handleSnackMessage, setHandleSnackMessage] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      showSnackbarMessage: () => {
        setHandleSnackMessage(true);

        setTimeout(() => {
          setHandleSnackMessage(false);
        }, 3000);
      },
    };
  });

  const transition = useTransition(handleSnackMessage, {
    from: { opacity: "0", cursorEvents: "none", top: "0" },
    enter: { opacity: "1", cursorEvents: "all", top: "90px" },
    leave: { opacity: "0", cursorEvents: "none", top: "0" },
  });

  return transition((style, item) =>
    item ? (
      <animated.div className="snack-message-wrapper p-0" style={style}>
        <div className=" py-3 px-4">
          <div className="d-flex align-items-center ">
            <div>
              {status === "success" ? (
                <img src={images.success} alt="error" className="mr-2" />
              ) : (
                <img src={images.error} alt="error" className="mr-2" />
              )}
            </div>
            <div
              className="mr-3"
              style={{
                fontSize: "0.875em",
                fontWeight: "500",
                color: "#070707",
              }}
            >
              {message}
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setHandleSnackMessage(false)}
            >
              <img src={images.close} alt="close" />
            </div>
          </div>
        </div>
        <div className="w-100" style={{ position: "relative" }}>
          <div
            className="snack-message-shape"
            style={{
              backgroundColor: status === "success" ? "#D0E4DA" : "#f0dad4",
            }}
          ></div>
        </div>
      </animated.div>
    ) : null
  );
});

export default SnackbarMessage;
