import axios from "axios";
import { API_URL } from "../constants/index";

export const showFeedbackReq = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}feedback/`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteFeedbackReq = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${API_URL}feedback/${id}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
