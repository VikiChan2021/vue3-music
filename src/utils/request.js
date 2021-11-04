/**
 * 网络请求函数
 */
import axios from "axios";
import config from "./config";

const request = (url, params = {}, method = "GET") => {
  return axios({
    url: config.host + url,
    params,
    method,
  }).then(
    (res) => {
      return res.data;
    },
    (err) => {
      console.log(err.message);
    }
  );
};

export default request;
