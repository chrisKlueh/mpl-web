import { post } from "axios";
import { API_URL } from "../constants/index";

export const loginReq = (username, password) => {
  post(`${API_URL}login/`, {
    username,
    password,
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
