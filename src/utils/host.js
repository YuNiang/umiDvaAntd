import curEnv from './env';
import { getArea } from './area';

const xiaoerHost = {
  local: 'dip.alibaba-inc.com/api/v2',
  daily: 'xiaoer.aliqin.taobao.net',
  pre: 'pre-aliqin.alibaba-inc.com',
  online: 'aliqin.alibaba-inc.com',
};

const crmHost = {
  local: 'dip.alibaba-inc.com/api/v2',
  daily: 'crm.aliqin.taobao.net/api/v1',
  pre: 'pre-crm-aliqin.alibaba-inc.com/api/v1',
  online: 'crm-aliqin.alibaba-inc.com/api/v1',
};

const overseaCrmHost = {
  local: 'dip.alibaba-inc.com/api/v2',
  daily: 'sg.crm.aliqin.taobao.net/api/v1',
  pre: 'pre-sg-crm-aliqin.aliyun-inc.com/api/v1',
  online: 'sg-crm-aliqin.aliyun-inc.com/api/v1',
};

const xiaoerWebHost = `//${xiaoerHost[curEnv]}`;
const getCrmWebHost = () => `//${(getArea() === 'china' ? crmHost : overseaCrmHost)[curEnv]}`;

export {
  xiaoerHost,
  xiaoerWebHost,
  getCrmWebHost,
};
