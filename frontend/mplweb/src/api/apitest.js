import Axios from "axios";
import { API_URL } from "../constants/index";

let callAPI = async ({ url, method, data }) => {
  return await Axios({
    url,
    method,
    data,
  });
};

export const getUserDetailReq = (id) => {
  callAPI({
    url: `${API_URL}users/${id}`,
  });
};
