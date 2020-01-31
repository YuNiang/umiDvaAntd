import { checkActions, checkPermissions } from '@/services/acl';

export default {
  namespace: 'acl',
  state: {
    urlPermission: [],
    permission: [],
  },

  effects: {
    *checkActions({ payload }, { call, put }) {
      const response = yield call(checkActions, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *checkPermissions({ payload }, { call, put }) {
      const response = yield call(checkPermissions, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        permission: action.payload || [],
      };
    },
    saveList(state, action) {
      return {
        ...state,
        urlPermission: action.payload || [],
      };
    },
  },
};
