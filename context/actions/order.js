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

export const getALlOrders = (queryParams = {}, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState()

    // Build query string from parameters
    const queryString = Object.keys(queryParams)
      .filter((key) => queryParams[key] !== undefined && queryParams[key] !== "")
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join("&")

    const url = `${APIURL}${GET_ALL_ORDERS}${queryString ? `?${queryString}` : ""}`

    ApiClient.get(url, {}, token, dispatch).then((response) => {
      if (response) {
        callback(response)
      }
    })
  }
}



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