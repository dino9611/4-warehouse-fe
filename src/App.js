import React, { useEffect, useState } from 'react';
import "./App.css";
import { Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./pages/non-user/Homepage";
import Product from "./pages/non-user/Product";
import ProfilePage from "./pages/user/ProfilePage";
import VerifyChangeEmail from "./pages/user/VerifyChangeEmail";
import { useDispatch, useSelector } from "react-redux";
import AdminMainParent from "./pages/admin/AdminMainParent";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminNotFound from './pages/admin/AdminNotFound';
import axios from 'axios';
import {API_URL} from "./constants/api";
import {LoginAction} from "./redux/actions";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TestPage from './TestPage';
import TestPage404 from './TestPage404';

function App() {
  const [loading, setLoading] = useState(true);

  // GET ROLE_ID DATA FROM REDUX STORE
  const getRoleId = useSelector(state => state.auth.role_id);
  const test = useSelector(state => state.auth); // Utk debug problem routing logout
  const dispatch = useDispatch();

  useEffect(() => {
    let token = localStorage.getItem("token");
    console.log("Line 24: ", test); // Utk debug problem routing logout
    if (token) {
        axios.get(`${API_URL}/auth/keeplogin`, {
            headers: {
              Authorization: "Bearer " + token,
            }
          }).then((res) => {
              dispatch(LoginAction(res.data));
          }).catch((err) => {
              console.log(err);
          }).finally(() => {
              setLoading(false);
          });
      } else {
        console.log("Line 38: ", test); // Utk debug problem routing logout
        setLoading(false);
      }
  }, []);

  const renderRouting = () => {
    console.log("getRoleId line 46: ", getRoleId); // Utk debug problem routing logout
    if (getRoleId === 3) { // * User Route
      return (
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/login" exact component="" />
          <Route path="/verify-email" exact component="" />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/auth/accept" exact component={VerifyChangeEmail} />
          <Route path="/products" exact component={Product} />
          <Route path="/products/:category" exact component="" />
          <Route path="/products/:productId" exact component="" />
          <Route path="/checkout" exact component="" />
          <Route path="/checkout/payment" exact component="" />
          <Route path="*" exact component="" />
        </Switch>
      );
    } else if (getRoleId === 1 || getRoleId === 2) { // * Super Admin & Admin Route
      return (
        <>
          {console.log("Masuk route ADMIN")}
          <Switch>
            <Route path="/" exact component={TestPage} />
            <Route path="/admin" exact component={AdminLogin} />
            {/* Routing sub page admin ada di component admin sidebar */}
            <Route path="/admin/:subPageAdmin" component={AdminMainParent} />
            {/* <Route path="/admin/dashboard" exact component={AdminMainParent} />
            <Route path="/admin/manage-product" exact component={AdminMainParent} />
            <Route path="/admin/manage-product/add" exact component={AdminMainParent} />
            <Route path="/admin/manage-product/edit" exact component={AdminMainParent} />
            <Route path="/admin/manage-transaction" exact component={AdminMainParent} />
            <Route path="/admin/stock-request" exact component={AdminMainParent} />
            <Route path="/admin/manage-warehouse" exact component={AdminMainParent} />
            <Route path="/admin/manage-admin" exact component={AdminMainParent} /> */}
            <Route path="*" component={TestPage404} />
          </Switch>
          <ToastContainer/>
        </>
      );
    } else { // * Non User & Non Admin Route
      return (
        <>
          {console.log("Masuk route non user")}
          <Switch>
            <Route path="/" exact component={TestPage} />
            <Route path="/login" exact component="" />
            <Route path="/register" exact component="" />
            <Route path="/products" exact component="" />
            <Route path="/products/:category" exact component="" />
            <Route path="/products/:productId" exact component="" />
            <Route path="/admin" exact component={AdminLogin} /> {/* Sengaja biar yg mau login ke admin bisa akses login admin nya */}
            <Route path="/admin/:subAdmin" component={AdminNotFound} />
            <Route path="*" component={TestPage404} />
          </Switch>
          <ToastContainer/> {/* Bila ingin menggunakan react-toastify, saat ini digunakan utk admin login & admin route */}
        </>
      );
    }
  };

  return (
    <div className="App">
      {loading ? <div>Loading</div> : renderRouting()}
    </div>
  );
}

export default App;