import { Children } from "react";
import "./styles/buttonPrimary.css";

function ButtonPrimary({ children, onClick, onMouseUp, width, disabled }) {
  return (
    <button
      className={`button-primary ${width}`}
      onClick={onClick}
      onMouseUp={onMouseUp}
      disabled={disabled ? true : false}
    >
      {children}
    </button>
  );
}

export default ButtonPrimary;
