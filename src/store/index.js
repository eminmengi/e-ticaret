import {
  legacy_createStore as createStore,
  applyMiddleware,
  combineReducers,
} from "redux";
import {thunk} from "redux-thunk";
import { createLogger } from "redux-logger";
import user from "./reducers/userReducer";

import client from "./reducers/clientReducer";
import product from "./reducers/productReducer";
import cart from "./reducers/cartReducer";
import category from "./reducers/categoryReducer";
import favorites from "./reducers/favoritesReducers";
import address from "./reducers/addressReducer";
import orders from "./reducers/ordersReducer";

const rootReducer = combineReducers({
  client,
  product,
  cart,
  user,
  category,
  favorites,
  address,
  orders,
});


const middlewares = [thunk];


if (import.meta?.env?.DEV) {
  const logger = createLogger({ collapsed: true });
  middlewares.push(logger);
}


const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;