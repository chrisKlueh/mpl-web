import { axiosInstance } from "./axiosApi";

export const showDemosReq = () => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`demos/`)
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
