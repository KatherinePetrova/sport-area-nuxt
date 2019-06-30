import axios from "axios";

export default () => {
  return axios.create({
    baseURL: "http://168.63.105.141:8000/api/",
    withCredentials: false,
    headers: {
      // Accept: "application/json"
      //'Content-Type': contentType
    }
  });
};
