import { ADD_CART_ITEM, REMOVE_CART_ITEM, UPDATE_CART_ITEM } from "../constants/cart";

const initialState = {
  cartItems: [],
};

export const cart = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CART_ITEM:
      var cartItems = [...state.cartItems];
      var index = cartItems.findIndex(
        (cartItem) => cartItem._id === action.data._id
      );

      if (index !== -1) {
        // Create a new object for the updated cart item
        const updatedItem = {
          ...cartItems[index],
          count: cartItems[index].count + action.data.count,
          notes: action.data.notes,
        };

        // Return a new state with the updated cart items array
        return {
          ...state,
          cartItems: [
            ...cartItems.slice(0, index),
            updatedItem,
            ...cartItems.slice(index + 1),
          ],
        };
      }

      // If item does not exist in cart, add it as a new item
      return {
        ...state,
        cartItems: [...cartItems, action.data],
      };

    case REMOVE_CART_ITEM:
      var cartItems = [...state.cartItems];
      var index = cartItems.findIndex(
        (cartItem) => cartItem._id === action.data
      );
      cartItems.splice(index, 1);
      return { ...state, cartItems: [...cartItems] };

    case UPDATE_CART_ITEM:
      return { ...state, cartItems: [...action.data] };

    default:
      return state;
  }
};
