import axios from "axios";
import { API_URL } from "../constants/index";

export const showDemosReq = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}demos/`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteDemoReq = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${API_URL}demos/${id}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
