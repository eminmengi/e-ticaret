// src/store/actions/orderActions.js
import axiosInstance from "../../api/axiosInstance";

export const GET_ORDERS_SUCCESS = "orders/GET_ORDERS_SUCCESS";
export const GET_ORDERS_FAIL = "orders/GET_ORDERS_FAIL";

export const getOrders = () => async (dispatch, getState) => {
  try {
    const token = getState().user?.token || localStorage.getItem("token");
    if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axiosInstance.get("/orders"); // backend endpoint
    dispatch({ type: GET_ORDERS_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: GET_ORDERS_FAIL, payload: err?.response?.data?.message });
  }
};
