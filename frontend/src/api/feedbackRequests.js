import axios from "axios";
import { API_URL } from "../constants/index";

export const showFeedbackReq = async () => {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: `${API_URL}feedback/`,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const submitFeedbackReq = async (
  feedbackType,
  feedback,
  demoId,
  generatedDetails
) => {
  let formData = new FormData();
  formData.append("type", feedbackType);
  formData.append("details", feedback);
  formData.append("demo", demoId);
  if (generatedDetails) {
    //truncate generated_details to the maximum length allowed by the database
    formData.append("generated_details", generatedDetails.substring(0, 1500));
  }

  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: `${API_URL}feedback/`,
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

export const deleteFeedbackReq = async (userId, feedbackId) => {
  let formData = new FormData();
  formData.append("user_id", userId);

  return new Promise((resolve, reject) => {
    axios({
      method: "delete",
      url: `${API_URL}feedback/${feedbackId}`,
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
