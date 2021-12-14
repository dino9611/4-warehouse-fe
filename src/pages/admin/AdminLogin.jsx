import "./styles/AdminLogin.css";
import React, { useEffect, useState } from 'react';
import AdminLoginImg from "../../assets/visuals/Admin_Login_01.png";
import ShowPassFalse from "../../assets/components/Show-Pass-False.svg";
import ShowPassTrue from "../../assets/components/Show-Pass-True.svg";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import {Link} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {LoginAction} from "../../redux/actions/AuthAction";
import {Redirect} from "react-router-dom"

function AdminLogin() {
    const [showPass, setShowPass] = useState("password");
    const [clickToggle, setClickToggle] = useState(false);

    const [userInput, setUserInput] = useState({
        inputtedUsername: "",
        inputtedPassword: "",
    });

    const {inputtedUsername, inputtedPassword} = userInput;

    const dispatch = useDispatch();

    // GET ISLOGIN & ROLE DATA FROM REDUX STORE
    const getIsLogin = useSelector(state => state.auth.is_login);
    const getRoleId = useSelector(state => state.auth.role_id);

    // HANDLER FUNCTIONS SECTION
    const inputChangeHandler = (event) => {
      setUserInput((prevState) => {
        return { ...prevState, [event.target.name]: event.target.value };
      });
    };

    const showPassHandler = (event) => {
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
        const { inputtedUsername, inputtedPassword } = userInput;
        try {
            const res = await axios.get(`${API_URL}/admin/login`, userInput);
            if (res.data.length) {
                localStorage.setItem("id",res.data[0].id);
                // dispatch(loginAction(res.data[0]));
            } else {
                // errorToast("User tidak ditemukan");
                alert("User tidak ditemukan");
            };
        } catch (error) {
        // errorToast("Server Error, from PublicLogin");
        alert("Server Error, from PublicLogin");
        console.log(error);
        };
    };

    // REDIRECT CONDITION IF ALREADY LOGIN & TRY ACCESS LOGIN PAGE
    if (getIsLogin && getRoleId === 1 || getRoleId === 2) {
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
                    <img src={AdminLoginImg} alt="Admin-Login-Page" />
                </div>
                <div className="adm-login-right-form">
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