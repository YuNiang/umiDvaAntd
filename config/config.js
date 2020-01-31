import os from 'os';
import webpackplugin from './plugin.config';
import pageRoutes from './router.config';
import defaultSettings from '../src/defaultSettings';

const HOST_MAP = {
  daily: '//g-assets.daily.taobao.net',
  publish: '//g.alicdn.com',
};
const GIT_VERSION = process.env.BUILD_GIT_BRANCH;
let publicPath = '/';
if (GIT_VERSION) {
  const branchVersion = GIT_VERSION.split('/');
  const env = branchVersion[0];
  const version = branchVersion[1];
  const host = HOST_MAP[env];
  publicPath = `${host}/alitx-service/admin-console/${version}/`;
}
export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
        },
        targets: { ie: 11 },
        ...(!process.env.TEST && os.platform() === 'darwin'
          ? {
              dll: {
                include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
                exclude: ['@babel/runtime'],
              },
              hardSource: false,
            }
          : {}),
      },
    ],
  ],
  runtimePublicPath: true,
  env: {
    development: {
      hash: true,
    },
    production: {
      publicPath,
      hash: false,
    },
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    classnames: 'classNames',
    '@antv/data-set': 'DataSet',
  },
  ignoreMomentLocale: true,
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  routes: pageRoutes,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    name: '测试中心',
    background_color: '#FFF',
    description: '很牛逼的平台.',
    display: 'standalone',
    start_url: '/index.html',
    icons: [
      {
        src: '/favicon.png',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
  },
  cssnano: {
    mergeRules: false,
  },
  chainWebpack: webpackplugin,
  disableDynamicImport: true,
};
