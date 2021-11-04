/**
 * 网络请求函数
 */
import axios from "axios";
import config from "./config";

axios.defaults.withCredentials = true; //配置为true

const request = (url, params = {}, method = "GET") => {
  return axios({
    url: config.host + url,
    params,
    method,
    // headers: {
    //   cookie:
    //     "__remember_me=true; MUSIC_U=16ec156f0aefa1488415b8ac7710f32fc1dd702d2d0d674d1d442da0f29dc714519e07624a9f0053d78b6050a17a35e705925a4e6992f61d07c385928f88e8de; MUSIC_A_T=1445742247852; MUSIC_R_T=1445742247857; __csrf=d337ad50fcbd529698a7a3298136220a; NMTID=00O5LsEL_sHmUj7N04jqImRJ5MvbegAAAF86cu83g",
    // },
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
