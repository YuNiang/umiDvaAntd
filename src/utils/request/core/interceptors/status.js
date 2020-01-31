import { HTTP_METHODS } from '../const';

// 判断 response.status 做特殊处理
export default [
  null,
  response => {
    const { config, status } = response;
    const method = config && config.method;

    // 不是 http 请求，透传
    if (!method || HTTP_METHODS.indexOf(method.toLowerCase()) === -1) {
      return response;
    }

    // 正常返回，透传
    if (status >= 200 && status < 300) {
      return response;
    }

    // 这里可以加上统一的 tips 处理什么的

    throw new Error(`${config.url} request error! code: ${status}`);
  },
];
