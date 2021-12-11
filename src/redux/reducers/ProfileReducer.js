const INITIAL_STATE = {
  chooseDate: "",
  handleCalender: false,
};

const profileReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "PICKDATE":
      return { ...state, chooseDate: action.payload, handleCalender: false };
    case "OPENCALENDER":
      return { ...state, handleCalender: !state.handleCalender };
    default:
      return state;
  }
};

export default profileReducer;
