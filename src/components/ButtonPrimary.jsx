import { Children } from "react";
import "./styles/buttonPrimary.css";

function ButtonPrimary({ children, onClick }) {
  return (
    <button className="button-primary" onClick={onClick}>
      {children}
    </button>
  );
}

export default ButtonPrimary;
