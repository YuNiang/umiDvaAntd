import { stringify } from 'query-string';
import request from '../utils/requestFetch';

const iHost = 'https://query.aliyun.com';
const COMMON_TOOLS = '/rest/q55T56eF7.document.gZNULEX7F';
const NAVIGATION = '/rest/q55T56eF7.navigation.immUKfR5i';
const TEAM_LARK = '/rest/q55T56eF7.Team_lark.8-Mk_SN5J';

const options = {
  isSimple: true,
  timeout: 50000,
};

export async function commonTools(data) {
  return request(`${iHost}${COMMON_TOOLS}?${stringify(data)}`, options);
}

export async function navigation(data) {
  return request(`${iHost}${NAVIGATION}?${stringify(data)}`, options);
}

export async function teamLark(data) {
  return request(`${iHost}${TEAM_LARK}?${stringify(data)}`, options);
}
