import React from 'react';
import T from 'prop-types';
import equals from 'shallow-equals';
import Statics from 'hoist-non-react-statics';
import req from './core/request';

const assertsValue = (params) => Object.keys(params).every(key => params[key] !== undefined);

export default function withRequest(BaseComponent) {
  /**
   * withRequest
   */
  class RequestComponent extends React.Component {
    static propTypes = {
      /**
       *  发送请求的地址
       */
      url: T.string,
      /**
       *  返回数据的格式化
       *  @return {object} {dataSource}
       */
      formatter: T.func,
      /**
       *  发送请求的参数
       */
      params: T.object,
      /**
       *  发送请求的方式
       */
      method: T.oneOf(['get', 'post', 'put', 'delete', 'jsonp']),
      /**
       * 发送请求的库
       */
      req: T.any,
      /**
       *  请求完毕后执行的方法
       *  @param {Object} param
       */
      beforeRequest: T.func,
      /**
       *  请求完毕后执行的方法
       * @param {Object} state
       */
      afterRequest: T.func,
      /**
       * 传入到组件的数据源
       */
      /* eslint-disable */
      dataSource: T.array,
      /**
       * 传入到底层axios的配置
       */
      /* eslint-disable */
      options: T.object
    };

    static defaultProps = {
      url: '',
      formatter: () => ({
        dataSource: []
      }),
      params: {},
      method: 'get',
      req,
      beforeRequest: () => {},
      afterRequest: () => {}
    };

    state = {};

    componentDidMount() {
      this.fetch();
    }

    componentWillReceiveProps(nextProps) {
      if (
          nextProps.method !== this.props.method
          || nextProps.url !== this.props.url
          || !equals(nextProps.params, this.props.params)
      ) {
        /* eslint-disable */
        this._needRefresh = true;
      }
    }

    componentDidUpdate() {
      /* eslint-disable */
      if (this._needRefresh) {
        this.fetch();
        this._needRefresh = false;
      }
    }

    fetch(params) {
      /* eslint-disable */
      params = params || this.props.params;
      const { beforeRequest, req, method, url, options, afterRequest, formatter } = this.props;
      if (params && assertsValue(params) || params) {
        beforeRequest(params);
        req[method](url, params, {
          ...options,
          formatter,
        }).then(ret => {
          this.setState(ret, () => {
            afterRequest(this.state);
          });
        });
      }
    }

    render() {
      const ds = this.props.dataSource || this.state.dataSource;
      /* eslint-disable */
      const { dataSource, ...others } = this.props;
      return (
        <BaseComponent {...others} {...this.state} dataSource={ds}  />
      );
    }
  }
  Statics(RequestComponent, BaseComponent);
  RequestComponent.displayName = `with(${BaseComponent.displayName || BaseComponent.name})`;
  return RequestComponent;
}
