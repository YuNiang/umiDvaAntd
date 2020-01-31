import { notification } from 'antd';

export default function(namespace, services) {
  const { query, add, del, update } = services;

  return {
    namespace,
    state: {
      data: {
        list: [],
        pagination: {},
      },
      loading: false,
      writting: false,
    },
    effects: {
      *query({ payload }, { call, put }) {
        yield put({
          type: 'changeLoading',
          payload: true,
        });

        const response = yield call(query, payload);

        yield put({
          type: 'changeLoading',
          payload: false,
        });

        if (response.pagination) {
          Object.assign(response.pagination, {
            pageSize: parseInt(response.pagination.pageSize, 10),
            current: parseInt(response.pagination.current, 10),
            total: parseInt(response.pagination.total, 10),
          });
        }

        yield put({
          type: 'setData',
          payload: {
            list: response.list,
            pagination: response.pagination,
          },
        });
      },

      *add({ payload }, { call, put }) {
        yield put({
          type: 'changeWriting',
          payload: true,
        });
        const result = yield call(add, payload);

        if (result) {
          notification.success({
            message: '添加成功',
          });
        }

        yield put({
          type: 'changeWriting',
          payload: false,
        });
      },

      *update({ payload }, { call, put }) {
        yield put({
          type: 'changeWriting',
          payload: true,
        });

        const result = yield call(update, payload);
        if (result) {
          notification.success({
            message: '修改成功',
          });
        }

        yield put({
          type: 'changeWriting',
          payload: false,
        });
      },

      *del({ payload }, { call, put }) {
        yield put({
          type: 'changeWriting',
          payload: true,
        });

        const result = yield call(del, payload);

        if (result) {
          notification.success({
            message: '删除成功',
          });
        }

        yield put({
          type: 'changeWriting',
          payload: false,
        });
      },
    },

    reducers: {
      setData(state, { payload }) {
        return {
          ...state,
          data: {
            list: payload.list || [],
            pagination: payload.pagination,
          },
        };
      },

      changeLoading(state, action) {
        return {
          ...state,
          loading: action.payload,
        };
      },
      changeWriting(state, action) {
        return {
          ...state,
          writting: action.payload,
        };
      },
    },
  };
}
