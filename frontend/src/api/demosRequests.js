import { axiosInstance } from "./axiosApi";

export const showDemosReq = () => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`demos/`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
