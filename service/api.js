import axios from "axios";

export default () => {
  return axios.create({
    baseURL: "http://80.241.42.214:8000/api/"
  });
};

// http://80.241.42.214:8000/api/booking/check/RANDOM_STRING_API_KEY_SET_IT_IN_THE_CABINET/
