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

export const uploadDemoReq = async (
  created_by,
  title,
  short_desc,
  detail_desc,
  file
) => {
  const formData = new FormData();
  formData.append("created_by", created_by);
  formData.append("title", title);
  formData.append("short_desc", short_desc);
  formData.append("detail_desc", detail_desc);
  formData.append("file", file[0]);

  console.log(created_by);
  console.log(title);
  console.log(short_desc);
  console.log(detail_desc);
  console.log(file);
  // return new Promise((resolve, reject) => {
  //   axios
  //     .post(`${API_URL}demos/`, {
  //       formData,
  //     })
  //     .then((response) => {
  //       resolve(response);
  //     })
  //     .catch((error) => {
  //       reject(error);
  //     });
  // });
};
