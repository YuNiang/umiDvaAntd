import React, { PureComponent } from 'react';
import { Button, Menu, Icon, Dropdown } from 'antd';
import { xiaoerHost } from '@/utils/host';
import curEnv from '@/utils/env';

const ENV_MAP = {
  daily: {
    label: 'Nebula',
    link: xiaoerHost.daily,
  },
  pre: {
    label: 'Plank',
    link: xiaoerHost.pre,
  },
  online: {
    label: 'Unity',
    link: xiaoerHost.online,
  },
};

export default class EnvSelecter extends PureComponent {
  state = {
    env: curEnv,
  };

  handleMenuClick = ({ key }) => {
    window.location.host = `${ENV_MAP[key].link}`;
  };

  render() {
    const { env } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="daily">{ENV_MAP.daily.label}</Menu.Item>
        <Menu.Item key="pre">{ENV_MAP.pre.label}</Menu.Item>
        <Menu.Item key="online">{ENV_MAP.online.label}</Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <Button style={{ marginLeft: 8 }} size="small">
          <Icon type="environment" theme="outlined" />
          {ENV_MAP[env] && ENV_MAP[env].label} <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}
