import axios from "axios";
import { hosturl } from "../Components/libs/Constant";
const axiosConfig = axios.create({
  baseURL: hosturl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - token expired or invalid");
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;
