import "./styles/LoadingApp.css";
import CircularProgress from '@mui/material/CircularProgress';

function LoadingApp() {
    return (
        <div className="loading-app-main-wrap">
            <CircularProgress />
            <h4>Please wait...we'll take you there.</h4>
        </div>
    )
}

export default LoadingApp;