import "./styles/AdminLoadSpinner.css";
import CircularProgress from '@mui/material/CircularProgress';

function AdminLoadSpinner() {
    return (
        <div className="adm-load-spinner-wrap">
            <CircularProgress />
        </div>
    )
}

export default AdminLoadSpinner;