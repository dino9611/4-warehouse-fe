const INITIAL_STATE = {
  chooseDate: null,
  handleCalender: false,
  profile_picture: "",
  username: "",
};

const profileReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "PICKDATE":
      return { ...state, chooseDate: action.payload, handleCalender: false };
    case "OPENCALENDER":
      return { ...state, handleCalender: !state.handleCalender };
    case "CLOSECALENDER":
      return { ...state, handleCalender: false };
    case "PICKIMAGE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default profileReducer;
