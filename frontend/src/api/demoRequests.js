import { axiosInstance } from "./axiosApi";

export const showDemoReq = async (id) => {
  return new Promise((resolve, reject) => {
    axiosInstance({
      method: "get",
      url: `demos/${id}`,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const uploadDemoReq = async (
  user_id,
  title,
  short_desc,
  detail_desc,
  file
) => {
  let formData = new FormData();
  formData.append("user_id", user_id);
  formData.append("title", title);
  formData.append("short_desc", short_desc);
  formData.append("detail_desc", detail_desc);
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    axiosInstance({
      method: "post",
      url: `demos/`,
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

export const editDemoReq = async (
  id,
  user_id,
  title,
  short_desc,
  detail_desc,
  file
) => {
  let formData = new FormData();
  formData.append("user_id", user_id);
  formData.append("title", title);
  formData.append("short_desc", short_desc);
  formData.append("detail_desc", detail_desc);
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    axiosInstance({
      method: "put",
      url: `demos/${id}`,
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
