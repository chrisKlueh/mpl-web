import { axiosInstance } from "./axiosApi";

export const loginReq = (group_name, password) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`token/obtain/`, {
        group_name,
        password,
      })
      .then((response) => {
        axiosInstance.defaults.headers["Authorization"] =
          "JWT " + response.data.access;
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const logoutReq = (refreshToken) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post("logout/", {
        refresh_token: refreshToken,
      })
      .then((response) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        axiosInstance.defaults.headers["Authorization"] = null;
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
