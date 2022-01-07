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
      className={`button-primary ${width} ${
        disabled ? "button-primary-disabled" : null
      }`}
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
