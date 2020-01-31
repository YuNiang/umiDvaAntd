import fetch from 'dva/fetch';
import React from 'react';
import { notification, Modal } from 'antd';
import Url from 'url';
import retCodeUtil from './retCodeUtil';


const loginPageUrl = {
  alicom_crm_bg_web: {
    daily: 'crm.aliqin.taobao.net',
    pre: 'crm-aliqin.alibaba-inc.com',
    prod: 'crm-aliqin.alibaba-inc.com',
  },
  'alicom-crm-bg-web-oxs': {
    daily: 'crm.aliqin.taobao.net',
    pre: 'pre-sg-crm-aliqin.aliyun-inc.com',
    online: 'sg-crm-aliqin.aliyun-inc.com',
  },
};
const env = window.ALITX_SERVICE_GLOBAL && window.ALITX_SERVICE_GLOBAL.env;

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

export default function request(url, options = {}) {
  const defaultOptions = {
    credentials: 'include',
    method: 'GET',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  const urlObj = Url.parse(/^\/\//.test(url) ? `https:${url}` : url);
  const rtc = retCodeUtil.retCode(urlObj.pathname);
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .then(
      res =>
        new Promise((resolve, reject) => {
          let val = res || {};
          if (/query.aliyun.com/.test(url)) {
            val = {
              code: 0,
              data: res,
              message: '',
            };
          }
          Object.assign(val, {
            code: Number(String(val.code) || '9999'),
          });
          const { code } = val;

          if (Number.isNaN(code)) {
            reject(new Error('返回的数据格式不对,请核对数据格式!'));
          }
          if (code === 0) {
            if (options && options.isSimple) {
              resolve(val.data);
              if (options.isShowSuc) {
                notification.success({
                  message: '请求成功',
                  description: val.message,
                });
              }
            } else {
              resolve(val);
            }
            rtc.success();
          } else if (code === 3) {
            const authName = val.data;
            const aclLink = `https://acl${
              env === 'daily' ? '-test' : ''
            }.alibaba-inc.com/apply/cart/detail.htm?pnames=${authName}`;
            Modal.info({
              title: '权限不足',
              content: (
                <a target="_blank" href={aclLink} rel="noopener noreferrer">
                  点击申请权限
                </a>
              ),
              okText: '申请完成',
            });
            resolve(val);
          } else if (code === 1001) {
            const { appName } = val.data;
            const loginLink = `//${loginPageUrl[appName.replace(/-/g, '_')][env]}`;
            Modal.info({
              title: '',
              content: (
                <a target="_blank" href={loginLink} rel="noopener noreferrer">
                  点击自动登录
                </a>
              ),
              okText: '登录完成',
            });
            resolve(val);
          } else {
            reject(val);
          }
        })
    )
    .catch(e => {
      let msg = '';
      if (e.code) {
        msg = e.message;
      }
      if ('stack' in e && 'message' in e) {
        msg = `请求错误: ${url}`;
        rtc.error(msg);
      }
      notification.error({
        message: '错误提示',
        description: msg,
      });

      return e;
    });
}
