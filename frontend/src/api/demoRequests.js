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
  user_group,
  title,
  short_desc,
  detail_desc,
  file
) => {
  let formData = new FormData();
  formData.append("group_id", user_group);
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
  user_group,
  title,
  short_desc,
  detail_desc,
  file,
  user_groups
) => {
  let formData = new FormData();
  formData.append("group_id", user_group);
  formData.append("title", title);
  formData.append("short_desc", short_desc);
  formData.append("detail_desc", detail_desc);
  formData.append("file", file);
  formData.append("user_groups", user_groups);

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

export const deleteDemoReq = async (user_id, demo_id) => {
  let formData = new FormData();
  formData.append("group_id", user_id);

  return new Promise((resolve, reject) => {
    axiosInstance({
      method: "delete",
      url: `demos/${demo_id}`,
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
