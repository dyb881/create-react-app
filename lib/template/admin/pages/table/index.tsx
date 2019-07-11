import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { IPage, IPageState, defaultPageState } from 'types';
import { Button } from 'antd';
import { Box, BoxItem, PageHeaders, FormBoxSearchs, Tables } from 'components';
import { createColumns } from './config';
import { table } from 'api';

@inject('store')
@observer
export default class extends React.Component<IPage, IPageState> {
  dataKey = 'root'; // 分页查询等数据
  columns = createColumns(this); // 数据列配置
  state = { ...defaultPageState };

  componentDidMount() {
    this.props.store!.user.onLogin(this.getList);
  }

  getList = async () => {
    this.setState({ loading: '加载列表' });
    const state = { loading: false, data: [], total: 0 };
    const { page, search } = this.props.store!.view.getTableData(this.dataKey);
    const res = await table.getList({
      pageNum: page.current || 1,
      pageSize: page.pageSize || 10,
      ...search,
    });
    if (res.ok) {
      state.data = res.data.list;
      state.total = res.data.total;
    }
    this.setState(state);
  };

  render() {
    const { loading, data, total } = this.state;
    const extra = (
      <Link to="/table/info">
        <Button type="primary">添加</Button>
      </Link>
    );
    return (
      <Box loading={loading}>
        <BoxItem>
          <PageHeaders extra={extra}>
            <FormBoxSearchs dataKey={this.dataKey} onChange={this.getList}>
              {ValueItem => (
                <>
                  <ValueItem label="数据源ID" name="dataSourceId" placeholder />
                </>
              )}
            </FormBoxSearchs>
          </PageHeaders>
          <Tables
            dataKey={this.dataKey}
            columns={this.columns}
            dataSource={data}
            pagination={{ total }}
            onChange={this.getList}
          />
        </BoxItem>
      </Box>
    );
  }
}
