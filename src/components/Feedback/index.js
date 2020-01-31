import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Tabs, Button, Input, Form, Checkbox, Upload, notification } from 'antd';
import classNames from 'classnames';

import styles from './index.less';

const { TabPane } = Tabs;
const { TextArea } = Input;

const propTypes = {
  sending: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  user: PropTypes.string,
  buttonText: PropTypes.node,
  title: PropTypes.node,
  closeButton: PropTypes.node,
};

const defaultProps = {
  sending: false,
  user: 'Unknown User',
  buttonText: (
    <span><Icon type="customer-service" theme="filled" /> 反馈与建议</span>
  ),
  title: (
    <span><Icon type="customer-service" theme="filled" /> 快速反馈</span>
  ),
  closeButton: 'close',
};

@Form.create()
class AlitxFeedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      selectedType: 'bug',
    };

    // Bind event handlers once to avoid performance issues with re-binding
    // on every render
    this.toggle = this.toggle.bind(this);
    this.send = this.send.bind(this);

    this.AlitxFeedback = React.createRef();
  }

  selectType = type => {
    this.setState({
      selectedType: type,
    });
  };

  close = () => {
    this.setState({
      active: false,
    });

    document.removeEventListener('click', this.handleClickOutside.bind(this));
  };

  activate = () => {
    this.setState(({ active }) => ({ active: !active }));

    document.addEventListener('click', this.handleClickOutside.bind(this));
  };

  send = () => {
    const {
      form: { validateFields, resetFields },
      user,
      onSubmit,
    } = this.props;
    const { selectedType } = this.state;
    const defaultParams = {
      userName: user,
      link: document.location.href,
      type: selectedType,
    };
    validateFields((err, values) => {
      if (!err) {
        const attachment = values.attachment.map(
          ({ response }) => response && response.data && response.data.url
        );
        if (onSubmit)
          onSubmit(Object.assign({}, defaultParams, values, { attachment }), () => {
            resetFields();
            this.close();
            notification.success({
              message: '反馈成功！',
            });
          });
      }
    });
  };

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  toggle = () => {
    const { active } = this.state;
    if (active) {
      this.close();
    } else {
      this.activate();
    }
  };

  handleClickOutside(event) {
    if (event.defaultPrevented) return;
    if (
      this.AlitxFeedback &&
      this.AlitxFeedback.current &&
      !this.AlitxFeedback.current.contains(event.target)
    ) {
      this.close();
    }
  }

  render() {
    const {
      title,
      closeButton,
      buttonText,
      form: { getFieldDecorator },
      sending,
    } = this.props;
    const { active, selectedType } = this.state;
    return (
      <div ref={this.AlitxFeedback} className={styles.feedback}>
        <Form
          className={classNames(styles.container, styles.fadeInUp, {
            [`${styles.active}`]: active,
          })}
        >
          <div className={styles.header}>
            {title}
            <div className={styles.close} onClick={this.close}>
              {closeButton}
            </div>
          </div>

          <div className={styles.content}>
            <Tabs defaultActiveKey="bug" onChange={this.selectType}>
              <TabPane
                tab={
                  <span>
                    <Icon type="apple" />
                    Bug
                  </span>
                }
                key="bug"
                forceRender
              >
                {selectedType === 'bug' ? (
                  <section>
                    <Form.Item label="问题描述" style={{ marginBottom: 0 }}>
                      {getFieldDecorator('desc', {
                        rules: [
                          {
                            required: true,
                            message: '请填写问题描述',
                          },
                        ],
                      })(<TextArea className={styles.textarea} placeholder="请输入地址描述" />)}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                      {getFieldDecorator('attachment', {
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                        rules: [
                          {
                            required: true,
                            message: '请上传问题截图',
                          },
                        ],
                      })(
                        <Upload action="/api/upload/oss" listType="picture">
                          <Button block>
                            <Icon type="upload" /> 上传截图
                          </Button>
                        </Upload>
                      )}
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                      {getFieldDecorator('sendURL', {
                        valuePropName: 'checked',
                        initialValue: true,
                      })(<Checkbox disabled>带上当前链接</Checkbox>)}
                    </Form.Item>
                    <Button type="primary" loading={sending} onClick={this.send} block>
                      提交
                    </Button>
                  </section>
                ) : null}
              </TabPane>
              <TabPane
                forceRender={false}
                tab={
                  <span>
                    <Icon type="android" />
                    需求
                  </span>
                }
                key="requirement"
              >
                <a
                  href="https://aone.alibaba-inc.com/project/660442/req?akProjectId=660442"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  请前往aone，去提需求
                </a>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="aliwangwang" />
                    建议
                  </span>
                }
                key="suggest"
                forceRender={false}
              >
                <a
                  href="http://gitlab.alibaba-inc.com/alitx-service/admin-console/issues/new?issue%5Bassignee_id%5D=&issue%5Bmilestone_id%5D="
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  前往gitlab,提个Issue
                </a>
              </TabPane>
            </Tabs>
          </div>
        </Form>

        <div
          className={classNames(styles.trigger, { [`${styles.active}`]: active })}
          onClick={this.toggle}
        >
          {buttonText}
        </div>
      </div>
    );
  }
}

AlitxFeedback.propTypes = propTypes;
AlitxFeedback.defaultProps = defaultProps;

export default AlitxFeedback;
