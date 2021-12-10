import "./styles/buttonPrimary.css";

function ButtonPrimary({ name, width, height }) {
  return (
    <button className="button-primary w-100" style={{ width, height }}>
      {name}
    </button>
  );
}

export default ButtonPrimary;
