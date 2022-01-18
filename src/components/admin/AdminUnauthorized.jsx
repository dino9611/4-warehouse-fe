import emptyState from "../../assets/components/Empty-Orders.svg";

function AdminUnauthorized({
    alignItems = "center",
    display = "flex",
    flexDirection = "column",
    justifyContent = "center",
    mainWrapMinHeight = "100%",
    rowGap = "1.5rem",
    mainWrapWidth = "100%",
    imgSrc = emptyState,
    imgHeight = "30%",
    imgWidth = "40%",
    textColor = "#5A5A5A",
    textAlign = "center",
    textContent = "You're unauthorized to access this page!",
}) {
    return (
        <div style={{
                alignItems: alignItems, 
                display: display, 
                flexDirection: flexDirection,
                justifyContent: justifyContent, 
                minHeight: mainWrapMinHeight, 
                rowGap: rowGap,
                width: mainWrapWidth
            }}
        >
            <img 
                src={imgSrc} 
                alt="Fetch-Data-Failed" 
                style={{height: imgHeight, width: imgWidth}}
            />
            <h4 style={{color: textColor, textAlign: textAlign}}>{textContent}</h4>
        </div>
    )
}

export default AdminUnauthorized;