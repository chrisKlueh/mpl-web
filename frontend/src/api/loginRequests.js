import { axiosInstance } from "./axiosApi";

export const loginReq = (group_name, password) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`token/obtain/`, {
        group_name,
        password,
      })
      .then((response) => {
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
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
