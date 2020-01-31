import qs from 'query-string'

const query = qs.parse(location.search || '');
const { host } = window.location || {};
let curEnv = 'local';

if (host.includes('127.0.0.1') || host.includes('localhost')) {
  curEnv = 'local';
}

if (query.env) {
  curEnv = env.current;
} else if (window.ALITX_SERVICE_GLOBAL) {
  curEnv = window.ALITX_SERVICE_GLOBAL.env;
  if (host.includes('pre')) {
    curEnv = 'pre';
  }
  
  if (!curEnv || curEnv === 'prod') {
    curEnv = 'online';
  }
}

export default curEnv;
