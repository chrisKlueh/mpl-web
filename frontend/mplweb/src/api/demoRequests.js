export const uploadDemoReq = async (
  created_by,
  title,
  short_desc,
  detail_desc,
  file
) => {
  const formData = new FormData();
  formData.append("created_by", created_by);
  formData.append("title", title);
  formData.append("short_desc", short_desc);
  formData.append("detail_desc", detail_desc);
  formData.append("file", file[0]);

  console.log(created_by);
  console.log(title);
  console.log(short_desc);
  console.log(detail_desc);
  console.log(file);
  console.log(file[0]);
  // return new Promise((resolve, reject) => {
  //   axios
  //     .post(`${API_URL}demos/`, {
  //       formData,
  //     })
  //     .then((response) => {
  //       resolve(response);
  //     })
  //     .catch((error) => {
  //       reject(error);
  //     });
  // });
};
