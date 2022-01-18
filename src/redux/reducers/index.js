import { combineReducers } from "redux";
import authReducers from "./AuthReducer";
import ProfileReducer from "./ProfileReducer";
import cartReducer from "./CartReducer";
import carouselReducer from "./CarouselReducer";
import snackbarMessageReducer from "./SnackbarMessageReducer";

export default combineReducers({
  auth: authReducers,
  ProfileReducer,
  cartReducer,
  carouselReducer,
  snackbarMessageReducer,
});
