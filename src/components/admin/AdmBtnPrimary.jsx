import "./styles/AdmBtnPrimary.css";

function AdmBtnPrimary({
  children,
  customClass,
  color,
  fontSize,
  fontWeight,
  height,
  padding,
  width,
  onClick,
  onBlur,
  disabled,
}) {
  return (
    <button
      className={`adm-btn-primary ${customClass}`}
      onClick={onClick}
      onBlur={onBlur}
      style={{ 
        color: color, 
        fontSize: fontSize, 
        fontWeight: fontWeight,
        height: height, 
        padding: padding,
        width: width, 
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default AdmBtnPrimary;