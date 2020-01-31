import { getCrmWebHost } from '@/utils/host';
import request from '@/utils/request/index';

const USERBASE_LIST = '/userbase/all/list';
const USERBASE_GROUP_LIST = '/userbase/same/group/list';

const options = {
  isSimple: true,
  timeout: 70000,
};

export async function queryUserBaseList(data) {
  return request.get(`${getCrmWebHost()}${USERBASE_LIST}`, data, options);
}

export async function queryUserGroupBaseList(data) {
  return request.get(`${getCrmWebHost()}${USERBASE_GROUP_LIST}`, data, options);
}
