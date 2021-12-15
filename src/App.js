import "./App.css";
import { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { Login } from "./pages/user";
import { Register, VerifyEmail } from "./pages/non-user";
import Home from "./pages/Home";
import { API_URL } from "./constants/api";
import { LoginAction } from "./redux/actions/AuthAction";
import { connect } from "react-redux";
import axios from "axios";

function App() {
  const role = "user";
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${API_URL}/auth/keeplogin`, {
          headers: {
            Authorization: "Bearer" + token,
          },
        })
        .then((res) => {
          this.props.LoginAction(res.data);
        })
        .catch((err) => {});
    }
  }, []);

  const renderRouting = () => {
    if (role === "user") {
      return (
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/verify-email" exact component={VerifyEmail} />
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
    } else if ((role = "admin")) {
      return (
        <Switch>
          <Route path="/admin" exact component="" />
          <Route path="/admin/dashboard" exact component="" />
          <Route path="/admin/manage-product" exact component="" />
          <Route path="/admin/manage-product/add" exact component="" />
          <Route path="/admin/manage-product/edit" exact component="" />
          <Route path="/admin/manage-transaction" exact component="" />
          <Route path="/admin/stock-request" exact component="" />
          <Route path="/admin/manage-warehouse" exact component="" />
          <Route path="/admin/manage-admin" exact component="" />
          <Route path="*" exact component="" />
        </Switch>
      );
    } else {
      return (
        <Switch>
          <Route path="/" exact component="" />
          <Route path="/login" exact component="" />
          <Route path="/register" exact component={Register} />
          <Route path="/products" exact component="" />
          <Route path="/products/:category" exact component="" />
          <Route path="/products/:productId" exact component="" />
          <Route path="*" exact component="" />
        </Switch>
      );
    }
  };

  return <div className="App">{renderRouting()}</div>;
}

export default connect(null, { LoginAction })(App);
