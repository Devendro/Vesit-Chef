import { RECENT_SEARCHED, FLOATING_BUTTON } from "../constants/food";

const initialState = {
    recentSearched : [],
    floatingButton: true
};

export const food = (state = initialState, action) => {
  switch (action.type) {
    case RECENT_SEARCHED:
      return { ...state, recentSearched: action.data };
    case FLOATING_BUTTON:
      return { ...state, floatingButton: action.data };
    default:
      return state;
  }
};
