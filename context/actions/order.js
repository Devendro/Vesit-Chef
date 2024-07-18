import { APIURL } from "../constants/api";
import ApiClient from "../../api-client";
import { CREATE_ORDER, UPDATE_ORDER_PAYMENT_STATUS } from "../constants/order";
import { GET_ALL_ORDERS, UPDATE_ORDER_STATUS } from "../constants/payment";

export const createOrder = (data, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.post(`${APIURL}${CREATE_ORDER}`, data, token, dispatch).then(
      (response) => {
        if (response) {
          callback(response);
        }
      }
    );
  };
};

export const updateOrderPaymentStatus = (data, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.put(
      `${APIURL}${UPDATE_ORDER_PAYMENT_STATUS}`,
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

export const getALlOrders = (data, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.get(`${APIURL}${GET_ALL_ORDERS}`, data, token, dispatch).then(
      (response) => {
        if (response) {
          callback(response);
        }
      }
    );
  };
};


export const updateOrderStatus = (data, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.put(`${APIURL}${UPDATE_ORDER_STATUS}`, data, token, dispatch).then(
      (response) => {
        if (response) {
          callback(response);
        }
      }
    );
  };
} 