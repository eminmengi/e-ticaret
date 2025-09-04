// store/thunks/orderThunks.js
import axiosInstance from "../../api/axiosInstance";

export const fetchOrders = () => async (dispatch, getState) => {
  try {
    const token = getState().user?.token || localStorage.getItem("token");
    if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axiosInstance.get("/user/orders");
    dispatch({ type: "ORDERS_SET_LIST", payload: res.data || [] });
  } catch (err) {
    console.error("Failed to fetch orders", err);
    dispatch({ type: "ORDERS_SET_LIST", payload: [] });
  }
};
