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
      <input
        type="text"
        placeholder={placeholder}
        className={`textbox-styling ${error ? "textbox-error" : null}`}
        style={{
          width,
          height,
        }}
        value={value}
        onChange={onChange}
        id={label}
      />
    </div>
  );
}

export default Textbox;
