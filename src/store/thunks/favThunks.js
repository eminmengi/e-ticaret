// src/store/thunks/favThunks.js
import axiosInstance from "../../api/axiosInstance";

export const fetchFavorites = () => async (dispatch, getState) => {
  try {
    const token = getState().user?.token || localStorage.getItem("token");
    if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await axiosInstance.get("/user/favorites");
    dispatch({ type: "FAVORITES_SET_LIST", payload: res.data || [] });
  } catch (err) {
    console.error("Failed to fetch favorites", err);
    dispatch({ type: "FAVORITES_SET_LIST", payload: [] });
  }
};
