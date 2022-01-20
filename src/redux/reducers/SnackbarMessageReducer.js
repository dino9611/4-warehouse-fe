const INITIAL_STATE = {
  ref: "",
  status: "",
  message: "",
};

const snackbarMessageReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SHOWSNACKBAR":
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

export default snackbarMessageReducer;
