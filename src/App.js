import React, { useEffect, useState } from "react";
import "./App.css";

import { Route, Switch } from "react-router-dom";
import { Login } from "./pages/user";
import { Register, VerifyEmail } from "./pages/non-user";

import { API_URL } from "./constants/api";

import { connect } from "react-redux";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./pages/non-user/Homepage";
import Product from "./pages/non-user/Product";
import ProfilePage from "./pages/user/ProfilePage";
import VerifyChangeEmail from "./pages/user/VerifyChangeEmail";
import { useDispatch, useSelector } from "react-redux";
import AdminMainParent from "./pages/admin/AdminMainParent";
import AdminLogin from "./pages/admin/AdminLogin";
import NotFound from "./pages/non-user/NotFoundV1";

import { LoginAction } from "./redux/actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const role = "user";
  const [loading, setLoading] = useState(true);

  // GET ROLE_ID DATA FROM REDUX STORE
  const getRoleId = useSelector((state) => state.auth.role_id);
  const dispatch = useDispatch();
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
        axios.get(`${API_URL}/auth/keeplogin`, {
            headers: {
              Authorization: "Bearer " + token
            }
          }).then((res) => {
              dispatch(LoginAction(res.data));
          }).catch((err) => {
              console.log(err);
          }).finally(() => {
              setLoading(false);
          });
      } else {
        setLoading(false);
      };
  }, []);

  const renderRouting = () => {
    if (getRoleId === 3) {
      // * User Route
      return (
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/login" exact component={Login} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/auth/accept" exact component={VerifyChangeEmail} />
          <Route path="/products" exact component={Product} />
          <Route path="/products/:category" exact component="" />
          <Route path="/products/:productId" exact component="" />
          <Route path="/checkout" exact component="" />
          <Route path="/checkout/payment" exact component="" />
          <Route path="*" component="" />
        </Switch>
      );
    } else if (getRoleId === 1 || getRoleId === 2) {
      // * Super Admin & Admin Route
      return (
        <>
          <Switch>
            <Route path="/admin" exact component={AdminLogin} />
            {/* Routing sub page admin ada di component admin sidebar */}
            <Route path="/admin/:subPageAdmin" component={AdminMainParent} />
            <Route path="*" component={NotFound} />
          </Switch>
          <ToastContainer />
        </>
      );
    } else {
      // * Non User & Non Admin Route
      return (
        <>
          <Switch>
            <Route path="/" exact component={Homepage} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/verify-email" exact component={VerifyEmail} />
            <Route path="/products" exact component="" />
            <Route path="/products/:category" exact component="" />
            <Route path="/products/:productId" exact component="" />
            <Route path="/admin" exact component={AdminLogin} />{" "}
            {/* Sengaja biar yg mau login ke admin bisa akses login admin nya */}
            <Route path="*" component={NotFound} />
          </Switch>
          <ToastContainer />{" "}
          {/* Bila ingin menggunakan react-toastify, saat ini digunakan utk admin login & admin route */}
        </>
      );
    }
  };

  return (
    <div className="App">
      {" "}
      {/* // ! Bila tidak menggunakan className App, cek terlebih dahulu apakah ada yg terpengaruh atau tidak */}
      {getRoleId === 1 || getRoleId === 2 ? null : <Header />}
      {loading ? <div>Loading</div> : renderRouting()}
      <div>{getRoleId === 1 || getRoleId === 2 ? null : <Footer />}</div>
    </div>
  );
}

export default connect(null, { LoginAction })(App);
