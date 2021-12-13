import "./App.css";
import { Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./pages/non-user/Homepage";
import Product from "./pages/non-user/Product";
import ProfilePage from "./pages/user/ProfilePage";
import VerifyChangeEmail from "./pages/user/VerifyChangeEmail";
import AdminMainParent from "./pages/admin/AdminMainParent";

function App() {
  const role = "admin";

  const renderRouting = () => {
    if (role == "user") {
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
    } else if (role == "admin") {
      return (
        <Switch>
          <Route path="/admin" exact component="" />
          {/* Routing sub page admin ada di component admin sidebar */}
          <Route path="/admin/dashboard" exact component={AdminMainParent} />
          <Route
            path="/admin/manage-product"
            exact
            component={AdminMainParent}
          />
          <Route
            path="/admin/manage-product/add"
            exact
            component={AdminMainParent}
          />
          <Route
            path="/admin/manage-product/edit"
            exact
            component={AdminMainParent}
          />
          <Route
            path="/admin/manage-transaction"
            exact
            component={AdminMainParent}
          />
          <Route
            path="/admin/stock-request"
            exact
            component={AdminMainParent}
          />
          <Route
            path="/admin/manage-warehouse"
            exact
            component={AdminMainParent}
          />
          <Route path="/admin/manage-admin" exact component={AdminMainParent} />
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
      <Header />

      <div>{renderRouting()}</div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
