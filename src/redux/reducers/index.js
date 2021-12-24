import { combineReducers } from "redux";
import ProfileReducer from "./ProfileReducer";
import cartReducer from "./CartReducer";

export default combineReducers({
  ProfileReducer,
  cartReducer,
});
