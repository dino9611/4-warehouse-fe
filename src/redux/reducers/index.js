import { combineReducers } from "redux";
import authReducers from "./AuthReducer";

export default combineReducers({
  auth: authReducers,
});