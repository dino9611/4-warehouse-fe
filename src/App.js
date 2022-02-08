import React, { useEffect, useRef, useState } from "react";
import "./App.css";

import { Route, Switch, useLocation } from "react-router-dom";
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
import DetailedProduct from "./pages/non-user/DetailedProduct";
import Checkout from "./pages/user/Checkout";
import Cart from "./pages/user/Cart";
import AdminLogin from "./pages/admin/AdminLogin";
import NotFound from "./pages/non-user/NotFoundV1";
import Payment from "./pages/user/Payment";
import LoadingApp from "./components/LoadingApp";
import ForgetPassInput from "./pages/user/ForgetPassInput";

import { LoginAction } from "./redux/actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SnackbarMessage from "./components/SnackbarMessage";

function App() {
  const dispatch = useDispatch();

  const dataSnackbar = useSelector((state) => state.snackbarMessageReducer);
  const [loading, setLoading] = useState(true);
  const DetectPath = () => {
    return useLocation().pathname;
  };

  let currentPath = DetectPath();

  const snackbarMessageRef = useRef();

  useEffect(() => {
    dispatch({ type: "SHOWSNACKBAR", payload: { ref: snackbarMessageRef } });
  }, []);

  // GET ROLE_ID DATA FROM REDUX STORE
  const getRoleId = useSelector((state) => state.auth.role_id);
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${API_URL}/auth/keeplogin`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          axios
            .get(`${API_URL}/transaction/get/total-item/${res.data.id}`)
            .then((resCart) => {
              dispatch({ type: "DATACART", payload: resCart.data });
            })
            .catch((error) => {
              console.log(error);
            });

          dispatch(LoginAction(res.data));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
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
          <Route
            path="/products/:productId"
            exact
            component={DetailedProduct}
          />
          <Route path="/products/:category" exact component="" />
          <Route path="/checkout" exact component={Checkout} />
          <Route path="/checkout/payment" exact component={Payment} />
          <Route path="/cart" exact component={Cart} />
          <Route path="*" component={NotFound} />
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
            <Route path="/products" exact component={Product} />
            <Route
              path="/products/:productId"
              exact
              component={DetailedProduct}
            />
            <Route path="/products/:category" exact component="" />
            <Route path="/admin" exact component={AdminLogin} />{" "}
            <Route path="/forget-password" exact component={ForgetPassInput} />
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
      {/* // ! Bila tidak menggunakan className App, cek terlebih dahulu apakah ada yg terpengaruh atau tidak */}
      {getRoleId === 3 || !getRoleId ? (
        <SnackbarMessage
          ref={snackbarMessageRef}
          status={dataSnackbar.status}
          message={dataSnackbar.message}
        />
      ) : null}
      {getRoleId === 1 ||
      getRoleId === 2 ||
      loading ||
      currentPath.includes("/admin") ? null : (
        <Header />
      )}
      {loading ? <LoadingApp /> : renderRouting()}
      <div>
        {getRoleId === 1 ||
        getRoleId === 2 ||
        loading || 
        currentPath.includes("/login") ||
        currentPath.includes("/register") ||
        currentPath.includes("/verify-email") ||
        currentPath.includes("/admin") ? null : (
          <Footer />
        )}
      </div>
    </div>
  );
}

export default connect(null, { LoginAction })(App);
