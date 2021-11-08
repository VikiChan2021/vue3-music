/**
 * 网络请求函数
 */
import axios from "axios";
import config from "./config";
import { COOKIE_KEY } from "@/assets/js/constant";

axios.defaults.withCredentials = true;

const request = (url, params = {}, method = "GET") => {
  return axios({
    url: config.host + url,
    params,
    method,
    // headers: {
    //   cookie:''
    // },
  }).then(
    (res) => {
      if (url === "/login/cellphone") {
        localStorage.setItem(COOKIE_KEY, res.data.cookie);
      }
      return res.data;
    },
    (err) => {
      console.log(err.message);
    }
  );
};

export default request;
