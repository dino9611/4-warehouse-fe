const INITIAL_STATE = {
  indexSusu: 0,
  indexBuah: 0,
  indexBumbu: 0,
  indexCoklat: 0,
  refSusu: null,
  refBuah: null,
  refBumbu: null,
  refCoklat: null,
};

const carouselReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "CHANGESUSU":
      return {
        ...state,
        indexSusu: action.payload.indexSusu,
        refSusu: action.payload.refSusu,
      };
    case "CHANGEBUAH":
      return {
        ...state,
        indexBuah: action.payload.indexBuah,
        refBuah: action.payload.refBuah,
      };
    case "CHANGEBUMBU":
      return {
        ...state,
        indexBumbu: action.payload.indexBumbu,
        refBumbu: action.payload.refBumbu,
      };
    case "CHANGECOKLAT":
      return {
        ...state,
        indexCoklat: action.payload.indexCoklat,
        refCoklat: action.payload.refCoklat,
      };

    case "RESETCAROUSEL":
      return INITIAL_STATE;

    default:
      return state;
  }
};

export default carouselReducer;
