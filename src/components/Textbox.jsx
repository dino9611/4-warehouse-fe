import React from "react";
import "./styles/textbox.css";

function Textbox({
  placeholder,
  width,
  height,
  label,
  value,
  onChange,
  error,
  name,
  disabled,
  onClick,
  cursor,
  backgroundColor,
}) {
  return (
    <div className="d-flex flex-column">
      {label ? (
        <label
          htmlFor={label}
          style={{ fontSize: "0.875em", fontWeight: "600" }}
        >
          {label}
        </label>
      ) : null}
      <div className="d-flex flex-column" onClick={onClick}>
        <input
          type="text"
          placeholder={placeholder}
          className={`textbox-styling ${error ? "textbox-error" : null}`}
          style={{
            width,
            height,
            cursor,
            backgroundColor,
          }}
          value={value}
          onChange={onChange}
          id={label}
          name={name}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default Textbox;
