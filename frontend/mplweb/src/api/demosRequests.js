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

export const deleteDemoReq = async (user_id, demo_id) => {
  let formData = new FormData();
  formData.append("user_id", user_id);

  return new Promise((resolve, reject) => {
    axios({
      method: "delete",
      url: `${API_URL}demos/${demo_id}`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
