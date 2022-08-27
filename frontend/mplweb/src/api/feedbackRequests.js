import { get } from "axios";
import { API_URL } from "../constants/index";

export const showFeedbackReq = () => {
  return new Promise((resolve, reject) => {
    get(`${API_URL}feedback/`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
