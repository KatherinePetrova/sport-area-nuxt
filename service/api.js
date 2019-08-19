import axios from "axios";
import https from "https";

export default () => {
  return axios.create({
    // httpsAgent: new https.Agent({
    //   rejectUnauthorized: false
    // }),
    baseURL: "http://80.241.42.214:8000/api/"
  });
};
