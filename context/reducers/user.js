import { LOGIN, REGISTER, LOGOUT } from "../constants/user";

const initialState = {
    registered: false,
    loggedIn: false,
    operator: [],
    count: 0,
    locations: [],
    logo: null,
    notifications: [],
    showWelcomeMessage: false,
    isNotificationDisabled: false,
  };
  
  export const user = (state = initialState, action) => {
    switch (action.type) {
      case REGISTER:
        return { ...state, registered: true, loggedIn: true, ...action.data };
      case LOGIN:
        return {
          ...state,
          loggedIn: true,
          ...action.data,
        };
      case "OTP":
        return { ...state, ...{ otp_in: true }, ...action.data };
      case "OPERATOR_LIST":
        return {
          ...state,
          operator: action.data,
          count: action.data.totalDocs,
          locations: action.data?.locations,
        };
  
      case "UPDATE_USER": {
        let optData = state.user.operator.docs;
        let optList = optData.map((item) => {
          if (item._id === action.data.id) {
            item.email = action.data.email;
            item.name = action.data.name;
          }
          return item;
        });
        return { ...state, user: { ...state.user, operator: { optList } } };
      }
      case "UPDATE_PROFILE":
        return { ...state, ...action.data };
      case "UPDATE_LOGO":
        return { ...state, logo: action.data?.blob_name };
      case LOGOUT:
        return initialState;
      case "SHOW_WELCOME_MESSAGE":
        return { ...state, showWelcomeMessage: action.payload };
      case "NOTIFICATION_LIST":
        return { ...state, notifications: action.payload };
      case "NOTIFICATION_DISABLE":
        return { ...state, isNotificationDisabled: action.payload };
  
      default:
        return state;
    }
  };
  