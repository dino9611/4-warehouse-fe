import { Children } from "react";
import "./styles/buttonPrimary.css";

<<<<<<< HEAD
function ButtonPrimary({ name, width, height }) {
  return (
    <button className="button-primary w-100" style={{ width, height }}>
      {name}
=======
function ButtonPrimary({ children, onClick }) {
  return (
    <button className="button-primary" onClick={onClick}>
      {children}
>>>>>>> develop
    </button>
  );
}

export default ButtonPrimary;
