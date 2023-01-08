import axios from "axios";
import { API_URL } from "../constants/index";
import { store } from "../store";
import { logoutSuccess } from "../slices/loginSlice";

export const clearToken = () => {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  axiosInstance.defaults.headers["Authorization"] = null;
};

export const setToken = (access, refresh) => {
  axiosInstance.defaults.headers["Authorization"] = "JWT " + access;
  sessionStorage.setItem("access_token", access);
  sessionStorage.setItem("refresh_token", refresh);
};

export const getToken = (type) => sessionStorage.getItem(type);

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    Authorization: getToken("access_token")
      ? "JWT " + getToken("access_token")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    // Prevent infinite loops early
    if (
      error.response.status === 401 &&
      originalRequest.url === "token/refresh/"
    ) {
      const originalRefreshToken = JSON.parse(originalRequest.data).refresh;
      const currentRefreshToken = getToken("refresh_token");
      // only log user out if the refresh token of the failed request is still
      // up to date; otherwise it has been refreshed by another request
      if (originalRefreshToken === currentRefreshToken) {
        console.log("Token refresh attempt: refresh token blacklisted.");
        store.dispatch(logoutSuccess());
        clearToken();
      } else {
        console.log("Token refresh attempt: token has already been renewed.");
      }
      return Promise.reject(error);
    }

    if (
      error.response.status === 400 &&
      originalRequest.url === "token/blacklist/"
    ) {
      console.log("Logout attempt: refresh token blacklisted");
      store.dispatch(logoutSuccess());
      clearToken();
      return Promise.reject(error);
    }

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = getToken("refresh_token");

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // exp date in token is expressed in seconds, now() returns milliseconds
        const now = Math.ceil(Date.now() / 1000);
        /* console.log(tokenParts.exp); */

        if (tokenParts.exp > now) {
          return axiosInstance
            .post("token/refresh/", { refresh: refreshToken })
            .then((response) => {
              setToken(response.data.access, response.data.refresh);

              axiosInstance.defaults.headers["Authorization"] =
                "JWT " + response.data.access;
              originalRequest.headers["Authorization"] =
                "JWT " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              originalRequest.headers["Authorization"] =
                axiosInstance.defaults.headers["Authorization"];
              return axiosInstance(originalRequest);
            });
        } else {
          console.log("Refresh token is expired.", tokenParts.exp, now);
          store.dispatch(logoutSuccess());
          clearToken();
        }
      } else {
        console.log("Refresh token not available.");
        store.dispatch(logoutSuccess());
        clearToken();
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);
