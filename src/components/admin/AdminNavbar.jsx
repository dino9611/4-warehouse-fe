import "./styles/AdminNavbar.css";
import { useSelector } from "react-redux";

function AdminNavbar() {
    const getRoleId = useSelector(state => state.auth.role_id)
    const getUsername = useSelector(state => state.auth.username)

    return (
        <nav className="adm-nav-main-wrap">
            <h6>Your Role: {getRoleId === 1 ? "Super Admin" : "Admin"}</h6>
            <h6>Hi, {getUsername}</h6>
        </nav>
    )
}

export default AdminNavbar;