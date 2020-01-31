import { stringify } from 'query-string';
import requestFetch from '@/utils/requestFetch';
import { xiaoerWebHost } from '../utils/host';
import request from '../utils/requestFetch';

const MK_TPL = '/api/dingtalk/mk';
const CARD_TPL = '/api/dingtalk/card';

const options = {
  isSimple: true,
  timeout: 30000,
};

export async function pushMK(params) {
  return request(`${xiaoerWebHost}${MK_TPL}?${stringify(params)}`, options);
}

export async function pushCard(params) {
  return requestFetch(`${xiaoerWebHost + CARD_TPL}`, {
    method: 'POST',
    body: params,
    ...options,
  });
}
