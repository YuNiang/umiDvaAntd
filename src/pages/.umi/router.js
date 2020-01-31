import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/global',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/BasicLayout'),
          LoadingComponent: require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/BasicLayout').default,
    routes: [
      {
        path: '/global/signIn',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../Dashboard/SignIn'),
              LoadingComponent: require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/components/PageLoading/index')
                .default,
            })
          : require('../Dashboard/SignIn').default,
        skip: true,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/node_modules/_umi-build-dev@1.16.7@umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/BasicLayout'),
          LoadingComponent: require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/BasicLayout').default,
    routes: [
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          {
            path: '/exception/403',
            name: 'not-permission',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Exception/403'),
                  LoadingComponent: require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/components/PageLoading/index')
                    .default,
                })
              : require('../Exception/403').default,
            skip: true,
            exact: true,
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Exception/404'),
                  LoadingComponent: require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/components/PageLoading/index')
                    .default,
                })
              : require('../Exception/404').default,
            skip: true,
            exact: true,
          },
          {
            path: '/exception/500',
            name: 'server-error',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Exception/500'),
                  LoadingComponent: require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/components/PageLoading/index')
                    .default,
                })
              : require('../Exception/500').default,
            skip: true,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/node_modules/_umi-build-dev@1.16.7@umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/',
        name: '首页',
        icon: 'dashboard',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../Dashboard/Workplace'),
              LoadingComponent: require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/components/PageLoading/index')
                .default,
            })
          : require('../Dashboard/Workplace').default,
        businessLine: ['YUN'],
        skip: true,
        exact: true,
      },
      {
        name: '手工',
        icon: 'user',
        path: '/supplier',
        businessLine: ['YUN'],
        routes: [
          {
            name: '查询',
            path: '/supplier/sameAccountNumber',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/pages/Supplier/sameAccountNumber/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../Supplier/sameAccountNumber'),
                  LoadingComponent: require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/components/PageLoading/index')
                    .default,
                })
              : require('../Supplier/sameAccountNumber').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/node_modules/_umi-build-dev@1.16.7@umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../404'),
              LoadingComponent: require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/components/PageLoading/index')
                .default,
            })
          : require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/node_modules/_umi-build-dev@1.16.7@umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/node_modules/_umi-build-dev@1.16.7@umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return <Router history={history}>{renderRoutes(routes, props)}</Router>;
  }
}
