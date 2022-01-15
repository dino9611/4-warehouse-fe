import "./styles/AdminLogin.css";
import React, { useState } from 'react';
import AdminLoginImg from "../../assets/visuals/Admin_Login_02.png";
import localLogo from "../../assets/logo.svg";
import ShowPassFalse from "../../assets/components/Show-Pass-False.svg";
import ShowPassTrue from "../../assets/components/Show-Pass-True.svg";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import { useSelector, useDispatch } from "react-redux";
import {LoginAction} from "../../redux/actions/AuthAction";
import {Redirect, useHistory} from "react-router-dom";
import { successToast, errorToast } from "../../redux/actions/ToastAction";

function AdminLogin() {
    const [showPass, setShowPass] = useState("password"); //* Utk ganti input type password, show/not

    const [clickToggle, setClickToggle] = useState(false); //* Toggle show password

    const [userInput, setUserInput] = useState({
        inputtedUsername: "",
        inputtedPassword: "",
    });

    const {inputtedUsername, inputtedPassword} = userInput;

    let history = useHistory();

    //* Utk kembali ke home
    const toHome = () => history.push("/");

    // SET UP ACTION DISPATCHER TO USE W/ ANY IMPORTED ACTIONS IN FILE
    const dispatch = useDispatch();

    // GET IS_LOGIN & ROLE_ID DATA FROM REDUX STORE
    const getIsLogin = useSelector(state => state.auth.is_login);

    const getRoleId = useSelector(state => state.auth.role_id);

    // HANDLER FUNCTIONS SECTION
    const inputChangeHandler = (event) => {
      setUserInput((prevState) => {
        return { ...prevState, [event.target.name]: event.target.value };
      });
    };

    const showPassHandler = () => {
        setClickToggle(!clickToggle);
        if (clickToggle) {
          setShowPass("text");
        } else {
          setShowPass("password");
        };
    };

    // CLICK FUNCTIONS SECTION
    const onLoginClick = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/admin/login`, userInput);
            if (res.data && !res.data.message) { //* Sengaja kondisi nya ini biar ga ke-trigger bisa login klo ada res.data.message (karena dri BE kirim message klo salah username/pass)
                localStorage.setItem("token", res.headers["x-token-access"]);
                dispatch(LoginAction(res.data));
                successToast(`Login successful! Welcome back!`)
            } else {
                errorToast(res.data.message);
            };
        } catch (error) {
            errorToast("Server Error, from AdminLogin");
            console.log(error);
        }
    };

    // REDIRECT CONDITION IF ALREADY LOGIN & TRY ACCESS LOGIN PAGE
    if (getIsLogin && (getRoleId === 1 || getRoleId === 2)) {
        return (
            <Redirect to="/admin/dashboard" />
        );
    } else if (getIsLogin && getRoleId === 3) {
        return (
            <Redirect to="/" />
        );
    };

    return (
        <div className="adm-login-main-wrap">
            <div className="adm-login-sub-wrap">
                <div className="adm-login-left-img">
                    <img src={AdminLoginImg} alt="Admin-Login-Page-Visual" />
                </div>
                <div className="adm-login-right-form">
                    <div className="adm-login-right-img">
                        <img src={localLogo} alt="The-Local-Logo" onClick={toHome}/>
                    </div>
                    <div className="adm-login-heading-wrap">
                        <h1>Admin Sign In</h1>
                        <p>Make sure you already have admin account or contact your super admin directly</p>
                    </div>
                    <form className="adm-login-form-wrap" onSubmit={onLoginClick}>
                        <p>Username</p>
                        <input
                            type="text"
                            name="inputtedUsername"
                            value={inputtedUsername}
                            onChange={(event) => inputChangeHandler(event)}
                            placeholder="Enter your username"
                        />
                        <p>Password</p>
                        <div className="adm-login-input-wrap">
                            <input
                                type={showPass}
                                name="inputtedPassword"
                                value={inputtedPassword}
                                onChange={(event) => inputChangeHandler(event)}
                                placeholder="Enter your password"
                            />
                            <img 
                                src={(showPass === "password") ? ShowPassFalse : ShowPassTrue} 
                                alt="Show-Pass-Icon" 
                                onClick={showPassHandler} 
                            />
                        </div>
                        <div className="adm-login-btn-wrap">
                            <button type="submit" className="adm-login-btn">Sign In</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin;