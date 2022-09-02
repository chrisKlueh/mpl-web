// import axios from "axios";
// import { API_URL } from "../constants/index";

export const spawnInstanceReq = async (id) => {
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
          },
        }),
      2000
    );
  });
};

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
            demo: 67,
            user: 13,
            host: "192.168.2.118",
            port: "8080",
          },
        }),
      2000
    );
  });
};
