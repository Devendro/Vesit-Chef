import AsyncStorage from "@react-native-async-storage/async-storage";
import { APIURL } from "../constants/api";
import ApiClient from "../../api-client";
import {
  LOGIN,
  LOGOUT,
  USER_LOGIN,
  SHOW_WELCOME_MESSAGE,
  TOKEN,
} from "../constants/user";

export const chefLogin = (data, callback) => {
  return (dispatch) => {
    ApiClient.post(`${APIURL}${USER_LOGIN}`, data).then((response) => {
    //   dispatch({ type: "ISLOADING", data: false });
    if (response.data && response.data.token) {
      dispatch({ type: LOGIN, data: response.data });
      dispatch({ type: SHOW_WELCOME_MESSAGE, data: false });
      AsyncStorage.setItem(TOKEN, JSON.stringify(response.data.token));
      AsyncStorage.setItem(LOGOUT, JSON.stringify(false));
      return callback(response);
    } else if (response.messageID === 404) {
      return callback(response);
    } else {
      callback(response)
    }
    });
  };
};
