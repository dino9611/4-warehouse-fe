import React from "react";
import images from "./../assets";
import "./styles/textbox.css";

function Textbox({
  placeholder,
  width,
  height,
  label,
  value,
  onChange,
  error,
  errormsg,
  successmsg,
  name,
  disabled,
  onClick,
  cursor,
  backgroundColor,
  borderRadius,
  type = "text",
  onBlur,
  maxLength,
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
          type={type}
          placeholder={placeholder}
          className={`textbox-styling ${error ? "textbox-error" : null}`}
          style={{
            width,
            height,
            cursor,
            backgroundColor,
            borderRadius,
          }}
          value={value}
          onChange={onChange}
          id={label}
          name={name}
          disabled={disabled}
          onBlur={onBlur}
          maxLength={maxLength}
        />
      </div>
      {error ? (
        <div className="d-flex align-items-center mt-1">
          {error ? (
            <>
              <img src={images.error} alt="error" className=" mr-1" />
              <div className="textbox-error-msg">{errormsg}</div>
            </>
          ) : (
            <>
              <img src={images.success} alt="success" className=" mr-1" />
              <div className="textbox-success-msg">{successmsg}</div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Textbox;
