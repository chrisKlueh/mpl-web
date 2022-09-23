import axios from "axios";
import { API_URL } from "../constants/index";

export const loginReq = (username, password) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}login/`, {
        username,
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