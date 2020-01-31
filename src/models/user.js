import { query as queryUsers, searchUser } from '../services/user';

const getUser = () => (window.ALITX_SERVICE_GLOBAL && window.ALITX_SERVICE_GLOBAL.user) || {};

export default {
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: getUser(),
    searchList: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    fetchUser: [
      function* search({ payload }, { call, put }) {
        const response = yield call(searchUser, payload);
        yield put({
          type: 'saveList',
          payload: response,
        });
      },
      { type: 'takeLatest' },
    ],
    *fetchCurrent(_, { put }) {
      const response = getUser();
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        searchList: action.payload || {
          count: 0,
          items: [],
        },
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
