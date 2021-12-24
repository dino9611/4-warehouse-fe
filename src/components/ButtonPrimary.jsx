import { Children } from "react";
import "./styles/buttonPrimary.css";

function ButtonPrimary({
  children,
  onClick,
  onMouseUp,
  width,
  disabled,
  fontSize,
}) {
  return (
    <button
      className={`button-primary ${width}`}
      onClick={onClick}
      onMouseUp={onMouseUp}
      style={{ fontSize }}
      disabled={disabled ? true : false}
    >
      {children}
    </button>
  );
}

export default ButtonPrimary;
