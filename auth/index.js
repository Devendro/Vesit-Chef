/*
 * @file: index.js
 * @description: Auth functions here
 * @date: 21.12.2021
 * @author: Nk
 * */

/******** Get User from store  ***********/
export const User = store => {
    return store.getState().user;
};

/******** Routing authentication middleware ***********/
export const Auth = store => {
    return User(store).loggedIn;
};
/******** Set Authorization token in header ***********/
export const setAuthorizationToken = (axios, token) => {
    if (token) {
        axios.defaults.headers.common.Authorization = token;
    } else {
        delete axios.defaults.headers.common.Authorization;
    }
};
