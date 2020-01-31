import axios from 'axios';
import addInterceptors from './interceptors';
import addMethods from './methods';

// 避免多个 request 产生冲突
const request = axios.create();

// 补齐 axios 上挂载的属性
Object.keys(axios).forEach(name => {
  if (!request[name]) {
    request[name] = axios[name];
  }
});

// add interceptors & methods
addInterceptors(request);
addMethods(request);

export default request;
