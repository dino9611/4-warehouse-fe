import "./styles/AdminLogin.css";
import React, { useEffect, useState } from 'react';

function AdminLogin() {
    const [userInput, setUserInput] = useState({
        inputtedUsername: "",
        inputtedPassword: "",
    });

    const {inputtedUsername, inputtedPassword} = userInput;

    const inputChangeHandler = (event) => {
      setUserInput((prevState) => {
        return { ...prevState, [event.target.name]: event.target.value };
      });
    };

    return (
        <div className="adm-login-main-wrap">
            <div className="adm-login-sub-wrap">
                <div className="adm-login-heading-wrap">
                    <h1>Admin Sign In</h1>
                    <p>Make sure you already have admin account or contact your super admin directly</p>
                </div>
                <form className="adm-login-form-wrap">
                    <p>Username</p>
                    <input
                        type="text"
                        name="inputtedUsername"
                        value={inputtedUsername}
                        onChange={(event) => inputChangeHandler(event)}
                        placeholder="Enter your username"
                    />
                    <p>Password</p>
                    <input
                        type="text"
                        name="inputtedPassword"
                        value={inputtedPassword}
                        onChange={(event) => inputChangeHandler(event)}
                        placeholder="Enter your password"
                    />
                    <div className="adm-login-btn-wrap">
                        <button type="submit" className="adm-login-btn">Sign In</button>
                    </div>
                </form>
                {/* <form className="d-flex flex-column justify-content-center w-75" onSubmit={onLoginClick}>
                    <h1 className="text-center fw-700 mb-3">Sign In</h1>
                    <p className="text-center m-0 mb-5">Sign in or create an account to enjoy member exclusive promo.</p>
                    <p className="m-0 mb-1">Username <span className="text-danger">*</span></p>
                    <input
                        type="text"
                        className="form-control shadow-none h-50px mb-4"
                        value={userInput.inputtedUsername}
                        onChange={usernameChangeHandler}
                    />
                    <p className="m-0 mb-1">Password <span className="text-danger">*</span></p>
                    <input
                        type={showPass}
                        className="form-control shadow-none h-50px mb-2"
                        value={userInput.inputtedPassword}
                        onChange={passwordChangeHandler}
                    />
                    <div className="f-row-start mb-4">
                        <input
                            type="checkbox"
                            className="form-check-input float-none m-0"
                            onClick={showPassHandler}
                        /> 
                        <p className="fs-0_8x m-0 ml-3">Show Password</p>
                    </div>
                    <button type="submit" className="btn main-btn-and-effect fw-500 h-50px mb-4">SIGN IN</button>
                </form> */}
            </div>
        </div>
    )
}

export default AdminLogin;