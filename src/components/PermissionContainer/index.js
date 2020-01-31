import React, { PureComponent, Fragment } from 'react';
import { Spin, Button } from 'antd';
import { connect } from 'dva';
import NoPermission from '../../pages/Exception/403';
import watermark from './watermark';

const ButtonGroup = Button.Group;
const { user: workUser, env } = window.ALITX_SERVICE_GLOBAL;

const mapDispatchToProps = dispatch => ({
  checkActions(params) {
    dispatch({
      type: 'acl/checkActions',
      payload: params,
    });
  },
  checkPermissions(params) {
    dispatch({
      type: 'acl/checkPermissions',
      payload: params,
    });
  },
  go(payload) {
    dispatch({
      type: 'global/routerNav',
      payload,
    });
  },
});

@connect(
  state => ({
    model: state.acl,
    loading: !!state.loading.effects['acl/checkActions'],
  }),
  mapDispatchToProps
)
class PermissionContainer extends PureComponent {
  componentDidMount() {
    this.acl();
    const { workid, name } = workUser;
    watermark('ant-layout-content', `${name} (${workid})`);
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location.pathname !== prevProps.location.pathname) {
      this.acl();
    }
  }

  acl = () => {
    const { checkActions, checkPermissions, location: { pathname },
      currentRouter: { skip = false, permissionLevel = 'menu', permissionName, component }
    } = this.props;
    // 没有填写权限名的情况下，按默认规则拼接权限名
    const defaultPermissionName = `alitx-service-web_url_${pathname.split('/')[1]}`;
    if (component && !skip && process.env.NODE_ENV !== 'development') {
      if (permissionLevel === 'menu') {
        checkPermissions({ name: permissionName || defaultPermissionName });
      } else {
        checkActions({ name: pathname });
      }
    }
  };

  render() {
    const {
      model: { urlPermission, permission },
      currentRouter: { skip = false, permissionLevel = 'menu', component, permissionName: pn },
      loading, location, children, go } = this.props;
    const { pathname } = location;
    const permissionName = pn || `alitx-service-web_url_${pathname.split('/')[1]}`;
    let permissionController = { url: pathname, accessible: false, permissionName };
    // 采用菜单鉴权，根据permissionName过滤
    if (permissionLevel === 'menu' && permission.length) {
      permissionController = permission.find(item => item.permissionName === permissionName);
    }
    // 采用URL鉴权，根据url过滤
    if (permissionLevel === 'url' && urlPermission.length) {
      permissionController = urlPermission.find(item => item.url === pathname);
    }
    const aclLink = `https://acl${env === 'daily' ? '-test' : ''}.alibaba-inc.com/apply/cart/detail.htm?pnames=${permissionController && permissionController.permissionName}`;
    const actions = (
      <div>
        <Button type="primary" onClick={() => go('/')}>返回首页</Button>
        <ButtonGroup>
          <a href={aclLink} target="_blank" rel="noopener noreferrer"><Button>申请权限</Button></a>
          <Button onClick={this.acl} loading={loading}>重新鉴权</Button>
        </ButtonGroup>
      </div>
    );
    return (
      <Fragment>
        {process.env.NODE_ENV === 'development' ||
        !component ||
        skip ||
        (permissionController && permissionController.accessible) ? (
          children
        ) : (
          <Spin spinning={loading} tip="鉴权中，请稍后"><NoPermission actions={actions} /></Spin>
        )}
      </Fragment>
    );
  }
}

export default PermissionContainer;
