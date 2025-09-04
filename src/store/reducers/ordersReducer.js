// src/store/reducers/ordersReducer.js
const initial = { items: [], error: null };

export default function orders(state = initial, action) {
  switch (action.type) {
    case "orders/GET_ORDERS_SUCCESS":
      return { ...state, items: action.payload, error: null };
    case "orders/GET_ORDERS_FAIL":
      return { ...state, error: action.payload };
    case "ORDERS_SET_LIST":
      return { ...state, items: action.payload };
    
    default:
      return state;
  }
}
