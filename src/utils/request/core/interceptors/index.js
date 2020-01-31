import rap from './rap';
import res from './res';

const defaultReject = error => Promise.reject(error);
/* eslint-disable */
function addInterceptor(axios, [req, res]) {
  if (req) {
    if (!Array.isArray(req)) {
      req = [req];
    }
    axios.interceptors.request.use(req[0], req[1] || defaultReject);
  }
  if (res) {
    if (!Array.isArray(res)) {
      res = [res];
    }
    axios.interceptors.response.use(res[0], res[1] || defaultReject);
  }
}

export default function addInterceptors(axios) {
  // 顺序很重要
  // TODO: 正式实现 status 的内容
  addInterceptor(axios, rap);
  // addInterceptor(axios, status);
  addInterceptor(axios, res);
}
