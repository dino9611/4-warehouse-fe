import "./styles/AdminNavbar.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { logoutAction } from "../../redux/actions";
import { useEffect } from "react";
import {Redirect} from "react-router-dom";

function AdminNavbar() {
    const getAuth = useSelector(state => state.auth); // Utk debug problem routing logout
    const getRoleId = useSelector(state => state.auth.role_id);
    const getUsername = useSelector(state => state.auth.username);

    const {is_login} = getAuth; // Utk debug problem routing logout

    const dispatch = useDispatch();

    const onLogout = () => {
        localStorage.removeItem("token");
        dispatch(logoutAction());
    };

    return (
        <nav className="adm-nav-main-wrap">
            <h6>Your Role: {getRoleId === 1 ? "Super Admin" : "Admin"}</h6>
            <div className="adm-nav-right-wrap">
                <h6>Hi, {getUsername}</h6>
                <Link to="/">
                    <button className="adm-nav-logout-btn" onClick={onLogout}>Logout</button>
                </Link>
            </div>
        </nav>
    )
}

export default AdminNavbar;