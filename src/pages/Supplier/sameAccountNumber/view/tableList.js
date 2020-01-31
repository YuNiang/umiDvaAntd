import React, { PureComponent } from 'react';
import { Card, Table, Form, Divider, Badge, Row, Col, Select, Button, Input, notification } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { SectionTitle } from '@/components/ComTitle/index';
import { formItemLayout, BLACK_TYPE, CURRENT_TYPE, CBM_TYPE, VARIABLE_TYPE } from '../utils/contants'

const FormItem = Form.Item;
const { Option } = Select;
const mapDispatchToProps = dispatch => ({
  queryUserBaseList(data) {
    dispatch({
      type: 'sameAccountNumber/getUserBaseList',
      payload: data
    })
  }
});
@Form.create()
@connect(state => ({
  sameAccountNumber: state.sameAccountNumber,
}), mapDispatchToProps)

class TableList extends PureComponent {
  defineColumns = () => [
    {
      title: 'partnerId',
      dataIndex: 'partnerId',
      key: 'partnerId',
      width: 180,
    },
    {
      title: '客户名称',
      dataIndex: 'custName',
      key: 'custName',
      width: 220,
    },
    {
      title: '客户来源',
      dataIndex: 'custFrom',
      key: 'custFrom',
      width: 140,
    },
    {
      title: '当前状态',
      dataIndex: 'list',
      key: 'list',
      width: 160,
      render: (value) => {
        const SUC_STATES = <Badge status="success" style={{ marginLeft: 6 }} />;
        const ERR_STATES = <Badge status="error" style={{ marginLeft: 6 }} />;
        if (!value) {
          return SUC_STATES;
        }
        return value.map(item => (
          <p>
            <span style={item.stopStatus ? { fontWeight: 'bolder', color: 'red' } : {}}>
              {item.osStatusName}
            </span>
            :{item.stopStatus ? ERR_STATES : SUC_STATES}
          </p>
        ));
      }
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 180,
    }
  ];

  handleSubmit = e => {
    if (e) { e.preventDefault() };
    const { form, queryUserBaseList, sameAccountNumber: { sameDataSource } } = this.props;
    const values = form.getFieldsValue();
    const params = {
      current: sameDataSource && sameDataSource.current || 1,
      pageSize: sameDataSource && sameDataSource.pageSize || 10,
      ...values
    };
    if (!params.partnerId && !params.aliyunUid) {
      notification.warning({
        message: 'partnerId账号 或者 aliyunUid账号 必填!'
      })
    } else {
      queryUserBaseList(params);
    }
  };

  searchFormRender = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col span={8}>
            <FormItem label="Id账号" {...formItemLayout}>
              {getFieldDecorator('partnerId')(
                <Input autocomplete="off" placeholder="请输入"  />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Uid账号" {...formItemLayout}>
              {getFieldDecorator('aliyunUid', {
                initialValue: ''
              })
              (<Input autocomplete="off" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="是否拉黑" {...formItemLayout}>
              {getFieldDecorator('isBlack', {
                initialValue: ''
              })(
                <Select placeholder="请选择">
                  {BLACK_TYPE.map(item => (
                    <Option value={item.value}>{item.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <FormItem label="当前状态" {...formItemLayout}>
              {getFieldDecorator('auditStatus', {
                initialValue: ''
              })(
                <Select placeholder="请选择">
                  {CURRENT_TYPE.map(item => (
                    <Option value={item.value}>{item.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="是否有绝活" {...formItemLayout}>
              {getFieldDecorator('isCBM', {
                initialValue: ''
              })(
                <Select placeholder="请选择">
                  {CBM_TYPE.map(item => (
                    <Option value={item.value}>{item.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="开通变量" {...formItemLayout}>
              {getFieldDecorator('anyParamsTpl', {
                initialValue: ''
              })(
                <Select placeholder="请选择">
                  {VARIABLE_TYPE.map(item => (
                    <Option value={item.value}>{item.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{ textAlign: "center" }}>
            <FormItem label="">
              <Button type="primary" htmlType="submit">查询</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }

  handleTableChange = (pagination) => {
    const { form, queryUserBaseList } = this.props;
    const values = form.getFieldsValue();
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...values
    };
    queryUserBaseList(params)
  };

  render() {
    const columns = this.defineColumns();
    const { sameAccountNumber: { baseDataSource, sameDataSource }} = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: false,
      total: sameDataSource && sameDataSource.total || 0,
      current: sameDataSource && sameDataSource.current || 1
    };
    return (
      <PageHeaderWrapper title='手工活数据'>
        <Card bordered={false}>
          {this.searchFormRender()}
          <Divider />
          <SectionTitle>输入账号信息</SectionTitle>
          <Table 
            pagination={false}
            bordered
            rowKey="custId"
            columns={columns}
            dataSource={baseDataSource || []}
          />
          <SectionTitle>放大客户输入账号信息</SectionTitle>
          <Table 
            bordered
            rowKey="custId"
            columns={columns}
            pagination={paginationProps}
            onChange={this.handleTableChange} 
            dataSource={sameDataSource.list || []}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
