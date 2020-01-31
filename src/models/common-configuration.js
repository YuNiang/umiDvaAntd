import { commonTools, navigation, teamLark } from '@/services/common-configuration';

export default {
  namespace: 'commonConfiguration',
  state: {
    tools: [],
    navs: [],
    teamLarks: [],
  },

  effects: {
    *commonTools({ payload }, { call, put }) {
      const response = yield call(commonTools, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *navigation({ payload }, { call, put }) {
      const response = yield call(navigation, payload);
      yield put({
        type: 'take',
        payload: response,
      });
    },
    *teamLark({ payload }, { call, put }) {
      const response = yield call(teamLark, payload);
      yield put({
        type: 'takeList',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        tools: action.payload || [],
      };
    },
    take(state, action) {
      return {
        ...state,
        navs: action.payload || [],
      };
    },
    takeList(state, action) {
      return {
        ...state,
        teamLarks: action.payload || [],
      };
    },
  },
};
