import { GET_CATEGORY } from "../constants/category";
import { APIURL } from "../constants/api";
import ApiClient from "../../api-client";

export const getCategories = (params, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.get(`${APIURL}${GET_CATEGORY}`, params, token, dispatch).then(
      (response) => {
        if (response) {
            dispatch({type: "CATEGORIES", data: response})
          callback(response);
        }
      }
    );
  };
};
