function getMetaContent(name) {
  const dom = window.document.querySelector(`meta[name=${name}]`);
  return (dom ? dom.getAttribute('content') || '' : '').trim();
}

export function retCode(apiName, isSuccess, timeDelay, code, msg) {
  if (window.openRetcode) {
    /* eslint-disable */
    window.__WPO && window.__WPO.retCode(apiName, isSuccess, timeDelay, code, msg);
  }
}

export function getCsrf() {
  if (getMetaContent('_csrf_enable') === 'true') {
    return {
      header: getMetaContent('_csrf_header'),
      token: getMetaContent('_csrf'),
    };
  }
  // TODO: 从 top 页面再拿一次？
}
