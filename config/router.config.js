module.exports = [
  {
    path: '/global',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/global/signIn',
        component: './Dashboard/SignIn',
        skip: true,
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
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
            component: './Exception/403',
            skip: true,
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
            skip: true,
          },
          {
            path: '/exception/500',
            name: 'server-error',
            hideInMenu: true,
            component: './Exception/500',
            skip: true,
          },
        ],
      },
      {
        path: '/',
        name: '首页',
        icon: 'dashboard',
        component: './Dashboard/Workplace',
        businessLine: ['YUN'],
        skip: true,
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
            component: './Supplier/sameAccountNumber',
          }
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
