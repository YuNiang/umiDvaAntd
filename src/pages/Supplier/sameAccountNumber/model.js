import { notification } from 'antd';
import { queryUserBaseList, queryUserGroupBaseList } from './service';

export default {
  namespace: 'sameAccountNumber',
  state: {
    baseDataSource: [],
    sameDataSource: {}
  },
  effects: {
    *getUserBaseList({ payload }, { call, put }) {
      const baseParams = {};
      if (payload.aliyunUid) {
        baseParams.aliyunUid = (payload.aliyunUid).trim();
      }
      if (payload.partnerId) {
        baseParams.partnerId = (payload.partnerId).trim();
      }
      const response = yield call(queryUserBaseList, baseParams);
      if (response && response.success) {
        yield put({
          type: 'userBaseList',
          payload: response,
        });
        const params = {
          pageSize: payload.pageSize || 10,
          current: payload.current || 1,
          aliyunUid: response.data && response.data.length ? response.data[0].aliyunUid : ''
        };
        if (params.aliyunUid) {
          const ret = yield call(queryUserGroupBaseList, params);
          if (ret && ret.success) {
            let data = ret.data.list || [];
            let tmpdata = [];
            if (payload.isCBM) {
              (data || []).forEach(i => {
                if (i.cbmWorkNo === payload.isCBM) {
                  tmpdata.push(i)
                }
              });
              data = tmpdata;
              tmpdata = [];
            }
            
            if (payload.anyParamsTpl) {
              (data || []).forEach(i => {
                if (i.anyParamsTpl === payload.anyParamsTpl) {
                  tmpdata.push(i)
                }
              });
              data = tmpdata;
              tmpdata = [];
            }
            if (payload.isBlack) {
              (data || []).forEach(i => {
                if (i.isBlack === payload.isBlack) {
                  tmpdata.push(i)
                }
              });
              data = tmpdata;
              tmpdata = [];
            }

            if (payload.auditStatus) {
              (data || []).forEach(i => {
                if (i.list) {
                  i.list.map(items => {
                    if (items.osStatusName === payload.auditStatus && items.stopStatus) {
                      return tmpdata.push(i);
                    }
                    return true;
                  })
                }
              });
              data = tmpdata;
              tmpdata = [];
            }
            const obj = {
              pageSize: ret.data.pagination.pageSize,
              current: ret.data.pagination.current,
              list: data
            }

            if (payload.anyParamsTpl || payload.auditStatus || payload.isCBM || payload.isBlack) {
              obj.total = data.length
            } else {
              obj.total = ret.data.pagination.total
            }
            yield put({
              type: 'sameBaseList',
              payload: obj,
            });
          } else {
            notification.warning({
              message: ret.message || '系统异常，稍后再试！'
            })
          }
        } else {
          const obj = {
            pageSize: 10,
            current: 1,
            total: 0,
            list: []
          }
          yield put({
            type: 'sameBaseList',
            payload: obj,
          });
        }
      } else {
        notification.warning({
          message: response.message || '系统异常，稍后再试！'
        })
      }
    },
  },
  reducers: {
    userBaseList(state, action) {
      const { data } = action.payload;
      return {
        ...state,
        baseDataSource: data || []
      };
    },
    sameBaseList(state, action) {
      return {
        ...state,
        sameDataSource: action.payload || {}
      };
    }
  },
};
