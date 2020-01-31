import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'acl', ...(require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/models/acl.js').default) });
app.model({ namespace: 'common-configuration', ...(require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/models/common-configuration.js').default) });
app.model({ namespace: 'error', ...(require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/models/error.js').default) });
app.model({ namespace: 'feedback', ...(require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/models/feedback.js').default) });
app.model({ namespace: 'global', ...(require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/models/global.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/Users/wb-zhangyuying.c/Desktop/alibaba/own/umiDvaAntd/src/models/user.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
