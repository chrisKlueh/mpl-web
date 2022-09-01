import axios from "axios";
import { API_URL } from "../constants/index";

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
      3000
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
            demo: 1,
            user: 1,
            host: "192.168.2.118",
            port: "8080",
          },
        }),
      3000
    );
  });
};
