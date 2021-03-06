const INITIAL_STATE = {
  id: null,
  username: "",
  email: "",
  role_id: null,
  is_login: null,
  is_verified: null,
  profile_picture: null,
  warehouse_id: null,
  warehouse_name: null
};

const authReducers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, ...action.payload, is_login: true };
    case "AFTER_VERIFIED":
      return { ...state, ...action.payload, is_login: true };
    case "EDITDATA":
      return { ...state, profile_picture: action.payload };
    case "LOGOUT":
      return INITIAL_STATE;

    default:
      return state;
  }
};

export default authReducers;
