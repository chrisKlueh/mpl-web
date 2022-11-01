import { axiosInstance } from "./axiosApi";

export const showGroupReq = async (id) => {
  return new Promise((resolve, reject) => {
    axiosInstance({
      method: "get",
      url: `groups/${id}`,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createGroupReq = async (
  groupId,
  groupName,
  password,
  confirmPassword,
  hasAdminPrivileges,
  accessibleDemos
) => {
  let formData = new FormData();
  formData.append("group_id", groupId);
  formData.append("group_name", groupName);
  formData.append("password", password);
  formData.append("is_admin", hasAdminPrivileges);
  formData.append("accessible_demos", accessibleDemos);

  return new Promise((resolve, reject) => {
    axiosInstance({
      method: "post",
      url: "groups/",
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

export const editGroupReq = async (
  groupId,
  targetGroupId,
  groupName,
  password,
  confirmPassword,
  hasAdminPrivileges,
  accessibleDemos
) => {
  let formData = new FormData();
  formData.append("group_id", groupId);
  formData.append("group_name", groupName);
  formData.append("password", password);
  formData.append("is_admin", hasAdminPrivileges);
  formData.append("accessible_demos", accessibleDemos);

  return new Promise((resolve, reject) => {
    axiosInstance({
      method: "put",
      url: `groups/${targetGroupId}`,
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

export const deleteGroupReq = async (group_id, target_group_id) => {
  let formData = new FormData();
  formData.append("group_id", group_id);
  formData.append("target_group_id", target_group_id);

  return new Promise((resolve, reject) => {
    axiosInstance({
      method: "delete",
      url: `groups/${target_group_id}`,
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
