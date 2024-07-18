/*
 * @file: index.js
 * @description: It Contain rest functions for api call .
 */
import axios from "axios";
import querystring from "querystring";
import { setAuthorizationToken } from "../auth";
var config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

const getIpAddress = async () => {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    const data = await response.data;
    return data.ip;
  } catch (error) {
    console.error("Error getting IP address:", error);
    return null;
  }
};

var ipAddress = "";

getIpAddress().then((ip) => {
  ipAddress = ip;
});

var logoutErrFlag = false;
var langHeaders = () => {
  return {
    headers: {
      ...config.headers,
      lang: "en",
      ipAddress: ipAddress,
    },
  };
};

const logout = (error, dispatch) => {
  if (dispatch && error.response.data && error.response.status === 401) {
    dispatch({ type: "LOGOUT", data: {} });
  }
};
class ApiClient {
  static post(url, params, token = null, dispatch = null) {
    if (token) setAuthorizationToken(axios, token);
    if (dispatch) dispatch({ type: "SORT", data: {} }); // reset previous sorting when post any new records
    return new Promise((fulfill, reject) => {
      axios
        .post(url, JSON.stringify(params), langHeaders())
        .then(function (response) {
          fulfill(response.data);
        })
        .catch(function (error) {
          if (error && error.response) {
            logout(error, dispatch);
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

  static put(url, params, token = null, dispatch = null) {
    setAuthorizationToken(axios, token);

    return new Promise(function (fulfill, reject) {
      axios
        .put(url, JSON.stringify(params), langHeaders())
        .then(function (response) {
          fulfill(response.data);
        })
        .catch(function (error) {
          if (error && error.response && !logoutErrFlag) {
            logout(error, dispatch);
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

  static get(url, params, token = null, dispatch = null) {
    setAuthorizationToken(axios, token);
    let query = querystring.stringify(params);
    url = query ? `${url}?${query}` : url;
    return new Promise(function (fulfill, reject) {
      axios
        .get(url, langHeaders())
        .then(function (response) {
          fulfill(response.data);
        })
        .catch(function (error) {
          if (error && error.response && !logoutErrFlag) {
            logout(error, dispatch);
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

  static fetch(url, params, token = null, dispatch = null) {
    setAuthorizationToken(axios, token);

    let query = querystring.stringify(params);
    url = query ? `${url}?${query}` : url;
    return new Promise(function (fulfill, reject) {
      axios
        .get(url, langHeaders())
        .then(function (response) {
          fulfill(response.data);
        })
        .catch(function (error) {
          if (error && error.response && !logoutErrFlag) {
            logout(error, dispatch);
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

  static patch(url, params, token = null, dispatch = null) {
    //  toast.dismiss();
    return new Promise(function (fulfill, reject) {
      axios
        .patch(url, JSON.stringify(params), langHeaders())
        .then(function (response) {
          fulfill(response.data);
        })
        .catch(function (error) {
          if (error && error.response && !logoutErrFlag) {
            logout(error, dispatch);
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

  static delete(url, token = null, dispatch = null) {
    //  toast.dismiss();
    setAuthorizationToken(axios, token);
    return new Promise(function (fulfill, reject) {
      axios
        .delete(url, langHeaders())
        .then(function (response) {
          //toast.dismiss();
          fulfill(response.data);
        })
        .catch(function (error) {
          if (error && error.response && !logoutErrFlag) {
            logout(error, dispatch);
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }
  /*************** Form-Data Method without file for Create ***********/
  static _postFormData(url, params, token = null, dispatch = null) {
    //  toast.dismiss();
    setAuthorizationToken(axios, token);
    if (dispatch) dispatch({ type: "SORT", data: {} }); // reset previous sorting when post any new records
    return new Promise(function (fulfill, reject) {
      axios
        .post(url, params, {
          ...langHeaders(),
          ...{
            headers: {
              "Content-Type": "multipart/form-data",
              slug: localStorage.getItem("SLUG")
                ? localStorage.getItem("SLUG")
                : "",
            },
          },
        })

        .then(function (response) {
          fulfill(response.data);
        })
        .catch(function (error) {
          if (error && error.response && !logoutErrFlag) {
            logout(error, dispatch);
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

  /*************** Form-Data Method for Update ***********/
  static _putFormData(url, params, token = null, dispatch = null) {
    //  toast.dismiss();
    setAuthorizationToken(axios, token);
    return new Promise(function (fulfill, reject) {
      axios
        .put(url, params, {
          ...langHeaders(),
          ...{ headers: { "Content-Type": "multipart/form-data" } },
        })

        .then(function (response) {
          fulfill(response.data);
        })
        .catch(function (error) {
          if (error && error.response && !logoutErrFlag) {
            logout(error, dispatch);
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

  /*************** Form-Data post with file Method ***********/
  static postFormData(
    url,
    body,
    token = null,
    dispatch = null,
    cancelToken = null
  ) {
    //toast.dismiss();
    setAuthorizationToken(axios, token);
    return new Promise((fulfill, reject) => {
      axios
        .post(url, body, {
          ...langHeaders(),
          ...{
            headers: { "Content-Type": "multipart/form-data" },
            ...cancelToken,
            /* onUploadProgress: (progressEvent) => {
            let d = (progressEvent.loaded / progressEvent.total) * 100;
            dispatch( uploadProgress((progressEvent.loaded / progressEvent.total) * 100))
          }*/
          },
        })

        .then((response) => {
          fulfill(response.data);
        })
        .catch((error) => {
          if (error && error.response && !logoutErrFlag) {
            logout(error, dispatch);
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

  /*************** Form-Data update with file Method ***********/
  static putFormData(url, body, token = null, dispatch = null) {
    //toast.dismiss();
    setAuthorizationToken(axios, token);
    return new Promise((fulfill, reject) => {
      axios
        .put(url, body, {
          ...langHeaders(),
          ...{
            headers: {
              "Content-Type": "multipart/form-data",
              slug: localStorage.getItem("SLUG")
                ? localStorage.getItem("SLUG")
                : "",
            },
          },
        })
        .then((response) => {
          fulfill(response.data);
        })
        .catch((error) => {
          if (error && error.response && !logoutErrFlag) {
            logout(error, dispatch);
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }
}

export default ApiClient;
