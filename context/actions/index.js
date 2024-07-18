import auth from "./auth";
import category from "./category";

export const useActions = (state, dispatch) => {
  return {
    auth: auth({ state, dispatch }),
    category: category({ state, dispatch }),
  };
};
