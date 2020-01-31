import request from '../utils/request';
import { getCrmWebHost } from '../utils/host';

const USER_KEYWORD = '/fuzzy/search/staf/info';

const options = {
  isSimple: true,
  timeout: 30000,
};

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function searchUser(data) {
  return request(getCrmWebHost() + USER_KEYWORD, data, options);
}
