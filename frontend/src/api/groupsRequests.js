import { axiosInstance } from "./axiosApi";

export const showGroupsReq = async (id) => {
  return new Promise((resolve, reject) => {
    axiosInstance({
      method: "get",
      url: "groups/",
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
