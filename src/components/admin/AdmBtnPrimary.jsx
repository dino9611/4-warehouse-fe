import "./styles/AdmBtnPrimary.css";

function AdmBtnPrimary({
  children,
  customClass,
  alignItems,
  color,
  display,
  justifyContent,
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
        alignItems: alignItems,
        color: color, 
        display: display,
        fontSize: fontSize, 
        fontWeight: fontWeight,
        height: height, 
        justifyContent: justifyContent,
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