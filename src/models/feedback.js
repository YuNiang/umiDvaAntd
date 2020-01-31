/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * @file:     简单table页面的model
 * @authors:  umi-plugin-tpl-pro 生成
 * @date      18/11/15
 */
import { pushMK } from '@/services/feedback';

const namespace = 'feedback';
export default {
  namespace,
  state: {
    formValues: {},
    data: {
      list: [],
      pagination: {},
    },
    // 页面初始化值
    initData: {},
    // url参数
    urlQueryParams: {},
    addInitData: {},
    detail: [],
  },
  effects: {
    *pushDingtalk({ payload, callback }, { call }) {
      let response;
      try {
        response = yield call(pushMK, payload);
        const { code, data } = response;
        if (code === 0) {
          callback(data);
        }
      } catch (error) {
        response = {};
        throw error;
      }
      return response;
    },
  },
  reducers: {
    saveUrlParams(state, action) {
      return {
        ...state,
        urlQueryParams: action.payload,
      };
    },
  },
};
