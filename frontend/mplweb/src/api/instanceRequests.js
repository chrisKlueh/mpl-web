import axios from "axios";
import { API_URL } from "../constants/index";

export const spawnInstanceReq = async (user_id, demo_id) => {
  let formData = new FormData();
  formData.append("user_id", user_id);
  formData.append("demo", demo_id);

  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: `${API_URL}instances/`,
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
//   return new Promise((resolve, reject) => {
//     setTimeout(
//       () =>
//         resolve({
//           data: {
//             id: 1,
//           },
//         }),
//       2000
//     );
//   });
// };

export const showInstanceReq = async (id) => {
  //   return new Promise((resolve, reject) => {
  //     axios({
  //       method: "get",
  //       url: `${API_URL}instances/${id}`,
  //     })
  //       .then((response) => {
  //         resolve(response);
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  return new Promise((resolve, reject) => {
    setTimeout(
      () =>
        resolve({
          data: {
            id: 1,
            //67 exists atm
            demo: 73,
            user: 13,
            host: "192.168.2.118",
            port: "8080",
          },
        }),
      2000
    );
  });
};

export const deleteInstanceReq = async (user_id, instance_id, host_id, pid) => {
  console.log("deleteInstanceReq");
  console.log(user_id, instance_id, host_id, pid);
  let formData = new FormData();
  formData.append("user_id", user_id);
  formData.append("host", host_id);
  formData.append("pid", pid);

  return new Promise((resolve, reject) => {
    axios({
      method: "delete",
      url: `${API_URL}instances/${instance_id}`,
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
