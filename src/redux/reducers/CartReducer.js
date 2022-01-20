const INITIAL_STATE = {
  totalItem: null,
};

const cartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "DATACART":
      return { ...state, totalItem: action.payload };
    case "TOTALNULL":
      return { ...state, totalItem: null };

    default:
      return state;
  }
};

export default cartReducer;
