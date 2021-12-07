import "./App.css";
import { Route, Switch } from "react-router-dom";
import Homepage from "./pages/non-user/Homepage";

function App() {
  const role = "user";

  const renderRouting = () => {
    if (role == "user") {
      return (
        <Switch>
          <Route path="/" exact component={Homepage} />
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
    } else if (role == "admin") {
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
          <Route path="/register" exact component="" />
          <Route path="/products" exact component="" />
          <Route path="/products/:category" exact component="" />
          <Route path="/products/:productId" exact component="" />
          <Route path="*" exact component="" />
        </Switch>
      );
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>{renderRouting()}</div>
      <div className="app-carousel d-flex justify-content-center"></div>
    </div>
  );
}

export default App;
