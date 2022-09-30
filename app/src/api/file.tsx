import request from "./request";
const headers = {
  "Content-Type": "multipart/form-data",
};
export const postFile = (data: any) =>
  request({
    method: "POST",
    url: "/file/upload",
    data: data,
    headers,
  });

export const getFileList = () =>
  request({
    method: "GET",
    url: "/file/list",
  });
export const downloadFile = (filename: string) =>
  request({
    method: "GET",
    url: "/file/" + filename,
    responseType: "blob",
  });
