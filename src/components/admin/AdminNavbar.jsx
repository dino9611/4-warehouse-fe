import "./styles/AdminNavbar.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { logoutAction } from "../../redux/actions";

function AdminNavbar() {
    const getRoleId = useSelector(state => state.auth.role_id);
    const getUsername = useSelector(state => state.auth.username);

    const dispatch = useDispatch();

    const onLogout = () => {
        localStorage.removeItem("token");
        dispatch(logoutAction());
    }

    return (
        <nav className="adm-nav-main-wrap">
            <h6>Your Role: {getRoleId === 1 ? "Super Admin" : "Admin"}</h6>
            <div className="adm-nav-right-wrap">
                <h6>Hi, {getUsername}</h6>
                <Link to="/admin">
                    <button className="adm-nav-logout-btn" onClick={onLogout}>Logout</button>
                </Link>
            </div>
        </nav>
    )
}

export default AdminNavbar;