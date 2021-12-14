const INITIAL_STATE = {
    id: null,
    username: "",
    email: "",
    role_id: null,
    is_login: null,
    is_verified: null,
    profile_picture: null,
};
  
const authReducers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, ...action.payload, is_login: true };
    case "AFTER_VERIFIED":
      return { ...state, ...action.payload, is_login: true };

    default:
      return state;
  }
};
  
export default authReducers;