import { get } from "axios";
import { API_URL } from "../constants/index";

export const showDemosReq = () => {
  return new Promise((resolve, reject) => {
    get(`${API_URL}demos/`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
