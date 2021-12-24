const INITIAL_STATE = {
  cart: [],
};

const cartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "DATACART":
      return { ...state, cart: action.payload };

    default:
      return state;
  }
};

export default cartReducer;
