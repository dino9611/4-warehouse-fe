import "./styles/buttonPrimary.css";

function ButtonPrimary({ name, onClick }) {
  return (
    <div
      className="button-primary-wrapper"
      style={{ width: "118px", height: "42px" }}
    >
      <div
        className="button-primary-text d-flex justify-content-center align-items-center"
        style={{ cursor: "pointer" }}
        onClick={onClick}
      >
        {name}
      </div>
    </div>
  );
}

export default ButtonPrimary;
