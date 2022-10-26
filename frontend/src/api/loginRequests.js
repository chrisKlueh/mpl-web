import { axiosInstance } from "./axiosApi";

export const loginReq = (group_name, password) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`token/obtain/`, {
        group_name,
        password,
      })
      .then((response) => {
        console.log(response);
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
