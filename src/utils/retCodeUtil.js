
'use strict';
let noop = function () {};

let WPO = {
  speed: noop,
  error: noop,
  retCode: noop,
  custom: noop,
  log: noop
};

function getWPO() {
  if (typeof window !== 'undefined' && window.__WPO) {
    WPO = window.__WPO;
    getWPO = () => WPO;
  }
  return WPO;
}


export class RetCode {
  constructor(api) {
    this.api = api;
    this.startTime = new Date().getTime();
  }

  finish(isSuccess, msg) {
    var endTime = new Date().getTime();
    var delay = endTime - this.startTime;
    getWPO().retCode(this.api, isSuccess, delay, msg);
  }

  retCode(api, isSuccess, delay, msg) {
    getWPO().retCode(api, isSuccess, delay, msg);
  }

  custom(category, key, value) {
    getWPO().custom(category, key, value);
  }

  error(category, msg) {
    getWPO().error(category, msg);
  }

  log(msg, sampling) {
    getWPO().log(msg, sampling);
  }

  speed(pos, delay, _immediately) {}

  success(msg = '接口调用成功') {
    this.finish(true, msg);
  }

  failed(msg = '接口调用失败') {
    this.finish(false, msg);
  }
}

const report = {
  retCode(api) {
    return new RetCode(api);
  }
};

export default report;
