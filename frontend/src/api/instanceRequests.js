import { axiosInstance } from "./axiosApi";

export const spawnInstanceReq = async (user_id, demo_id) => {
  let formData = new FormData();
  formData.append("group_id", user_id);
  formData.append("demo", demo_id);

  return new Promise((resolve, reject) => {
    axiosInstance({
      method: "post",
      url: `instances/`,
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

export const deleteInstanceReq = async (user_id, instance_id) => {
  let formData = new FormData();
  formData.append("group_id", user_id);

  return new Promise((resolve, reject) => {
    axiosInstance({
      method: "delete",
      url: `instances/${instance_id}`,
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
