import { combineReducers } from "redux";
import authReducers from "./AuthReducer";
import ProfileReducer from "./ProfileReducer";

export default combineReducers({
  auth: authReducers,
  ProfileReducer,
});