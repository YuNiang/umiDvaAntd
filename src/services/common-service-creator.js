import request from '../utils/request';

export default function(API) {
  const ret = {};
  const { query, add, update, del } = API;

  if (query) {
    ret.query = async data =>
      request(query, data).then(res => {
        if (res.code === 0) {
          return res.data || {};
        }
        return {};
      });
  }

  if (add) {
    ret.add = async data => request(add, data).then(res => res.code === 0);
  }

  if (update) {
    ret.update = async data => request(update, data).then(res => res.code === 0);
  }

  if (del) {
    ret.del = async data => request(del, data).then(res => res.code === 0);
  }

  return ret;
}

export function createService(api, type = 'object') {
  return async data =>
    request(api, data).then(res => {
      switch (type) {
        case 'bool':
          return res.code === 0;
        case 'array':
          return res.code === 0 && Array.isArray(res.data) ? res.data : [];
        case 'object':
        default:
          return res.code === 0 && res.data ? res.data : {};
      }
    });
}
