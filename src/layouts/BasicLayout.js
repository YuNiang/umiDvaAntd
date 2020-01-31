import React from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import DocumentTitle from 'react-document-title';
import memoizeOne from 'memoize-one';
import deepEqual from 'lodash.isequal';
import { ContainerQuery } from 'react-container-query';
import pathToRegexp from 'path-to-regexp';
import qs from 'query-string';
import { unenquireScreen } from 'enquire-js';
import Feedback from '@/components/Feedback';
import SiderMenu from '@/components/SiderMenu';
import Authorized from '@/utils/Authorized';
import SettingDrawer from '@/components/SettingDrawer';
import PermissionContainer from '@/components/PermissionContainer';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';

const logo = '//img.alicdn.com/tfs/TB195vVeS_I8KJjy0FoXXaFnVXa-600-600.png';
const { Content } = Layout;
const { user: workUser, env } = window.ALITX_SERVICE_GLOBAL;

function formatter(data, parentPath, parentAuthority, parentName) {
  return data.map(item => {
    let locale = 'menu';
    if (parentName && item.name) {
      locale = `${parentName}.${item.name}`;
    } else if (item.name) {
      locale = `menu.${item.name}`;
    } else if (parentName) {
      locale = parentName;
    }
    const result = {
      ...item,
      locale,
      authority: item.authority || parentAuthority,
    };
    if (item.routes) {
      const children = formatter(item.routes, `${parentPath}${item.path}/`, item.authority, locale);
      result.children = children;
    }
    delete result.routes;
    return result;
  });
}

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, deepEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const menuData = this.getMenuData();
    this.state = {
      customerMenu: [],
      menuData,
      editable: false,
    };
  }

  getChildContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  componentDidMount() {
    const { routerNav } = this.props;
    const { menuData } = this.state;
    if (!menuData.length) {
      routerNav('/global/business');
    }
  }

  componentDidUpdate(prevProps) {
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { location } = this.props;
    const preLocation = prevProps.location;
    if (location.pathname !== preLocation.pathname || location.search !== preLocation.search) {
      this.onRouteChanged(location, preLocation);
    }
  }

  componentWillUnmount() {
    if (unenquireScreen) unenquireScreen(this.enquireHandler);
  }

  onRouteChanged(curLocation, preLocation) {
    // 跳转的时候，保留env 和  area 参数，防止运营手动刷新
    let curQs = qs.parse(curLocation.search);
    const preQs = qs.parse(preLocation.search);
    if (preQs && preQs.env) {
      curQs = Object.assign({}, { env: preQs.env }, curQs);
    }
    if (preQs && preQs.area) {
      curQs = Object.assign({}, { area: preQs.area }, curQs);
    }
    const { history } = this.props;
    history.replace(`${curLocation.pathname}?${qs.stringify(curQs)}`, curLocation.state);
    this.log();
  }

  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  getMenuData() {
    const {
      route: { routes },
    } = this.props;
    return formatter(routes);
  }

  getContext() {
    return {
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getCurrRouterData = memoizeOne(pathname => {
    let currRouterData = null;
    Object.keys(this.breadcrumbNameMap).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = this.breadcrumbNameMap[key];
      }
    });
    return currRouterData;
  });

  getPageTitle = pathname => {
    const currRouterData = this.getCurrRouterData(pathname);
    if (!currRouterData) {
      return 'UmiJS测试';
    }
    const { name } = currRouterData
    return `${name} - UmiJS测试`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu') {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { handleMenuCollapse } = this.props;
    handleMenuCollapse(collapsed);
  };

  onEditable = editable => {
    const { customerMenu } = this.state;
    if (!editable) {
      window.localStorage.setItem('_alitx_menu', customerMenu);
    }
    this.setState({ editable });
  };

  updateMenu = fields => {
    const customerMenu = Object.keys(fields).filter(item => !fields[item]);
    this.setState({
      customerMenu,
    });
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '2px 2px 0',
      paddingTop: fixedHeader ? 64 : 0,
    };
  };

  log = () => {
    const hashName = this.getPageTitle();
    const { workid, name, dep } = workUser;
    if (env === 'prod') {
      window.WTLog('visit', {
        hashName,
        workId: workid,
        workName: name,
        dep,
      });
    }
  };

  render() {
    const {
      navTheme,
      children,
      location: { pathname, search },
      pushDingtalk,
      feedbackLoading,
    } = this.props;
    const { customerMenu, editable, businessLine } = this.state;
    const menuData = this.getMenuData();
    const currentRouter = this.getCurrRouterData(pathname) || {};
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          Authorized={Authorized}
          theme={navTheme}
          onEditable={this.onEditable}
          onCollapse={this.handleMenuCollapse}
          updateMenu={this.updateMenu}
          customerMenu={customerMenu}
          editable={editable}
          menuData={menuData}
          {...this.props}
        />
        <Layout style={{ ...this.getLayoutStyle(), minHeight: '100vh' }}>
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            editable={editable}
            onEditable={this.onEditable}
            updateMenu={this.updateMenu}
            customerMenu={customerMenu}
            logo={logo}
            {...this.props}
          />
          <Content style={this.getContentStyle()}>
            <PermissionContainer currentRouter={currentRouter} {...this.props}>
              {children}
            </PermissionContainer>
            <Feedback
              onSubmit={pushDingtalk}
              sending={feedbackLoading}
              channel="测试"
              showChannel={false}
              disabled={false}
              user={workUser.name}
              emoji=":bug:"
            />
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );

    return (
      <React.Fragment key={search}>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        {process.env.NODE_ENV === 'production' ? null : (
          <SettingDrawer />
        )}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  pushDingtalk(params, callback) {
    dispatch({
      type: 'feedback/pushDingtalk',
      payload: params,
      callback,
    });
  },
  handleMenuCollapse(collapsed) {
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  },
  routerNav(payload) {
    dispatch({
      type: 'global/routerNav',
      payload,
    });
  },
});

export default connect(
  ({ global, setting, loading }) => ({
    feedbackLoading: loading.effects[`feedback/pushDingtalk`],
    collapsed: global.collapsed,
    layout: setting.layout,
    ...setting,
  }),
  mapDispatchToProps
)(BasicLayout);
