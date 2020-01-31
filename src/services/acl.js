import { stringify } from 'query-string';
import request from '../utils/requestFetch';
import { xiaoerWebHost } from '../utils/host';

const CHECK_PERMISSION = '/api/permission/name';
const CHECK_ACTIONS = '/api/permission/url';

const options = {
  isSimple: true,
  timeout: 50000,
};

export async function checkPermissions(data) {
  return request(`${xiaoerWebHost}${CHECK_PERMISSION}?${stringify(data)}`, options);
}

export async function checkActions(data) {
  return request(`${xiaoerWebHost}${CHECK_ACTIONS}?${stringify(data)}`, options);
}
