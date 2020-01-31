import qs from 'qs';
import { HTTP_METHODS } from '../const';
import { retCode, getCsrf } from '../utils';

// 处理 ajax 请求：
// - 打通 retcode 打点
// - csrf token
/* eslint-disable */
export default function addAjaxMethod(axios) {
  HTTP_METHODS.forEach(method => {
    axios[method] = (pathname, params = {}, config = {}) => {
      const t = Date.now();

      // params 处理
      if (method === 'get') {
        config.params = params;
      } else {
        const contentType = config.headers && config.headers['content-type'];
        if (contentType && contentType.indexOf('application/x-www-form-urlencoded') > -1) {
          config.data = qs.stringify(params);
        } else {
          config.data = params;
        }
      }

      // csrf
      const csrf = getCsrf();
      if (csrf) {
        config.headers = config.headers || {};
        config.headers[csrf.header] = csrf.token;
      }

      return axios({
        url: pathname,
        method,
        withCredentials: true,
        ...config,
      }).then(data => {
        const time = Date.now() - t;
        retCode(pathname, true, time, 'ajax-success', `接口${pathname}调用成功!`);
        return data;
      }).catch(error => {
        const time = Date.now() - t;
        retCode(pathname, false, time, 'ajax-error', `接口${pathname}调用失败! message:[${(error)}]`);
        throw error;
      });
    };
  });
}
