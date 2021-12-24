import "./App.css";
import { Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./pages/non-user/Homepage";
import Product from "./pages/non-user/Product";
import ProfilePage from "./pages/user/ProfilePage";
import VerifyChangeEmail from "./pages/user/VerifyChangeEmail";
import AdminMainParent from "./pages/admin/AdminMainParent";
import DetailedProduct from "./pages/non-user/DetailedProduct";
import Checkout from "./pages/user/Checkout";
import Cart from "./pages/user/Cart";
import { useEffect } from "react";
import axios from "axios";
import { API_URL } from "./constants/api";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        let resCart = await axios.get(
          `${API_URL}/transaction/get/cart-detail/2`
        ); // userId harusnya dari auth user redux
        let resProfile = await axios.get(`${API_URL}/profile/personal-data/2`); // User id sementara ( nanti dari redux)

        dispatch({
          type: "PICKIMAGE",
          payload: {
            profile_picture: resProfile.data[0].profile_picture,
            username: resProfile.data[0].username,
          },
        });

        dispatch({ type: "DATACART", payload: resCart.data });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const role = "user";

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
          <Route
            path="/products/:productId"
            exact
            component={DetailedProduct}
          />
          <Route path="/products/:category" exact component="" />
          <Route path="/checkout" exact component={Checkout} />
          <Route path="/checkout/payment" exact component="" />
          <Route path="/cart" exact component={Cart} />
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
