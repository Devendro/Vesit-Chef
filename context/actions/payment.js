import { APIURL } from "../constants/api";
import ApiClient from "../../api-client";
import { CREATE_PAYMENT, CREATE_PAYMENT_ORDER } from "../constants/payment";

export const createPaymentOrder = (data, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.post(
      `${APIURL}${CREATE_PAYMENT_ORDER}`,
      data,
      token,
      dispatch
    ).then((response) => {
      if (response) {
        callback(response);
      }
    });
  };
};


export const createPayment = (data, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.post(
      `${APIURL}${CREATE_PAYMENT}`,
      data,
      token,
      dispatch
    ).then((response) => {
      if (response) {
        callback(response);
      }
    });
  };
};
