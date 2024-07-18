/*********** Reducers defined here *********/

import { persistCombineReducers } from "redux-persist";
import { user } from "./user";
import { categories } from "./categories";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { food } from "./food";
import { cart } from "./cart";

const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
};

export default persistCombineReducers(rootPersistConfig, { user, categories, food, cart });
