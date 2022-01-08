import emptyState from "../../assets/components/Empty-Orders.svg";

function AdminFetchFailed({
    alignItems = "center",
    display = "flex",
    flexDirection = "column",
    justifyContent = "center",
    mainWrapMinHeight = "80vh",
    rowGap = "1.5rem",
    mainWrapWidth = "100%",
    imgSrc = emptyState,
    imgHeight = "30%",
    imgWidth = "40%",
    textColor = "#5A5A5A",
    textAlign = "center",
    textContent = "Oops...unexpected things happened, please try again",
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
            <h3 style={{color: textColor, textAlign: textAlign}}>{textContent}</h3>
        </div>
    )
}

export default AdminFetchFailed;