import { combineReducers } from "redux";
import authReducers from "./AuthReducer";
import ProfileReducer from "./ProfileReducer";
import cartReducer from "./CartReducer";

export default combineReducers({
  auth: authReducers,
  ProfileReducer,
  cartReducer,
});
