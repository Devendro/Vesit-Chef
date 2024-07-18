import { APIURL } from "../constants/api";
import ApiClient from "../../api-client";
import { SEARCH_FOOD, GET_FOOD } from "../constants/food";

export const searchFoods = (params, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.get(`${APIURL}${SEARCH_FOOD}`, params, token, dispatch).then(
      (response) => {
        if (response) {
          callback(response);
        }
      }
    );
  };
};

export const getFoods = (params, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.get(`${APIURL}${GET_FOOD}`, params, token, dispatch).then(
      (response) => {
        if (response) {
          callback(response);
        }
      }
    );
  };
};
