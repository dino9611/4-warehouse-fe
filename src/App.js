import React, { useEffect, useState } from 'react';
import "./App.css";
import { Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminMainParent from "./pages/admin/AdminMainParent";
import AdminLogin from "./pages/admin/AdminLogin";
import axios from 'axios';
import {API_URL} from "./constants/api";
import {LoginAction} from "./redux/actions";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loading, setLoading] = useState(true);

  // GET ROLE_ID DATA FROM REDUX STORE
  const getRoleId = useSelector(state => state.auth.role_id);
  const dispatch = useDispatch();

  useEffect(() => {
    let token = localStorage.getItem("token");
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
        setLoading(false);
      }
  }, []);

  const renderRouting = () => {
    if (getRoleId === 3) { // * User Route
      return (
        <Switch>
          <Route path="/" exact component="" />
          <Route path="/login" exact component="" />
          <Route path="/verify-email" exact component="" />
          <Route path="/profile" exact component="" />
          <Route path="/profile/history" exact component="" />
          <Route path="/profile/history/detail/:orderId" exact component="" />
          <Route path="/profile/address" exact component="" />
          <Route path="/profile/address/add" exact component="" />
          <Route path="/products" exact component="" />
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
          <Switch>
            <Route path="/admin" exact component={AdminLogin} />
            {/* Routing sub page admin ada di component admin sidebar */}
            <Route path="/admin/dashboard" exact component={AdminMainParent} />
            <Route path="/admin/manage-product" exact component={AdminMainParent} />
            <Route path="/admin/manage-product/add" exact component={AdminMainParent} />
            <Route path="/admin/manage-product/edit" exact component={AdminMainParent} />
            <Route path="/admin/manage-transaction" exact component={AdminMainParent} />
            <Route path="/admin/stock-request" exact component={AdminMainParent} />
            <Route path="/admin/manage-warehouse" exact component={AdminMainParent} />
            <Route path="/admin/manage-admin" exact component={AdminMainParent} />
            <Route path="*" exact component="" />
          </Switch>
          <ToastContainer style={{ width: "400px" }}/>
        </>
      );
    } else { // * Non User & Non Admin Route
      return (
        <>
          <Switch>
            <Route path="/" exact component="" />
            <Route path="/login" exact component="" />
            <Route path="/register" exact component="" />
            <Route path="/products" exact component="" />
            <Route path="/products/:category" exact component="" />
            <Route path="/products/:productId" exact component="" />
            <Route path="/admin" exact component={AdminLogin} /> {/* Sengaja biar yg mau login ke admin bisa akses login admin nya */}
            <Route path="*" exact component="" />
          </Switch>
          <ToastContainer style={{ width: "400px" }}/> {/* Bila ingin menggunakan react-toastify, saat ini digunakan utk admin login & admin route */}
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