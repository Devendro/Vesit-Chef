import { CATEGORIES } from "../constants/category";

const initialState = {};

export const categories = (state = initialState, action) => {
  switch (action.type) {
    case CATEGORIES:
      return { ...state, ...action.data };
    default:
      return state;
  }
};
