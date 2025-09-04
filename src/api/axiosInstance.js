import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://workintech-fe-ecommerce.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Token’ı header’a ekleyen yardımcı fonksiyon
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export default axiosInstance;
