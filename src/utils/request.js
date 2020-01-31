import React from 'react';
import fetch from 'fetch-jsonp';
import { notification, Modal, message } from 'antd';
import querystring from 'query-string';
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

function checkStatus(response) {
  if (response.redirected) {
    window.location.href = response.url;
  }
  if (response.ok) {
    return response;
  }
  const { status, url, statusText } = response;

  return {
    code: '9999',
    message: `[${status}]${url}: 请求错误，${statusText} `,
  };
}


export default function request(url, data = {}, options = { timeout: 120000 }) {
  let newUrl = url;
  // fetch api 需要的参数，credentials为发送凭证
  const fetchOptions = {
    timeout: 12000,
    credentials: 'include',
    method: options.method || 'get',
    headers: new Headers(),
  };
  Object.assign(data, {
    _input_charset: 'UTF-8',
  });
  fetchOptions.headers.append('Charset', 'utf-8');
  // get 请求时拼接url，否则传给fetch 的 body
  if (fetchOptions.method === 'get') {
    fetchOptions.headers = new Headers({
      'Content-Type': 'text/json;charset=UTF-8', // 指定提交方式为表单提交
    });
    const urlParams = querystring.stringify(data, {
      arrayFormat: 'bracket',
    });
    newUrl += (url.indexOf('?') !== -1 ? '&' : '?') + urlParams;
  } else {
    fetchOptions.headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    fetchOptions.body = data;
  }

  const urlObj = Url.parse(/^\/\//.test(newUrl) ? `https:${newUrl}` : newUrl);
  const rtc = retCodeUtil.retCode(urlObj.pathname);
  return fetch(newUrl, fetchOptions, options)
    .then(checkStatus)
    .then(response => response.json())
    .then(res =>
      new Promise((resolve, reject) => {
        const val = res || {};
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
                message: options.successMessage || '请求成功',
                description: val.message,
              });
            }
          } else {
            resolve(val);
          }
          rtc.success();
        } else if (code === 3) {
          const authName = val.data;
          const aclLink = `https://acl${env === 'daily' ? '-test' : ''}.alibaba-inc.com/apply/cart/detail.htm?pnames=${authName}`;
          Modal.info({
            title: '权限不足',
            content: (
              <a target="_blank" href={aclLink} rel="noopener noreferrer">点击申请权限</a>
            ),
            okText: '申请完成',
          });
          resolve(val);
        } else if (code === 1001) {
          const { appName } = val.data;
          const loginLink = `//${loginPageUrl[appName.replace(/-/g, '_')][env]}`;
          if (env !== 'local') {
            return message.loading('5秒后，将进行自动登录！', 5, () => document.location.reload(true));
          }
          Modal.info({
            title: '',
            content: (
              <a target="_blank" href={loginLink} rel="noopener noreferrer">点击自动登录</a>
            ),
            okText: '登录完成',
          });
          resolve(val);
        } else {
          reject(val);
        }
        return true;
      })
    )
    .catch(error => {
      let msg = '';
      // 由于后端在服务器层面接入了sso的特殊原因，所以无法返回未登录的状态码，而fetch也拿不到302，cookie也是readonly的，只能通过error.message判断
      if (error.message === 'Failed to fetch') {
        message.error('需要登录，将进行自动登录！');
        const backUrl = window.location.href;
        const domain = process.env.NODE_ENV === 'production' ? 'https://login.alibaba-inc.com' : 'https://login-test.alibaba-inc.com';
        window.location.href = `${domain}/ssoLogin.htm?APP_NAME=alitx-service-console-web&BACK_URL=${backUrl}`;
      }
      if (error.code) {
        msg = error.message;
        rtc.error(`${error.code} - ${error.message}`);
      }
      if ('stack' in error && 'message' in error) {
        msg = `请求错误: ${url}`;
        rtc.error(error.message);
      }

      notification.error({
        message: '错误提示',
        description: msg,
      });

      return error;
    });
}
