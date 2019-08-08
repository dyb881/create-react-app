import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';
import { Page, RouterPageHeader, FormSearch, AutoTable, Pagination } from 'components';
import { IStore } from 'types';
import { createColumns } from './config';
import { admin } from 'api';

@inject('store')
@observer
export default class extends React.Component<IStore> {
  columns = createColumns(this);

  state = {
    data: [],
  };

  componentDidMount() {
    this.getList();
  }

  getList = async () => {
    this.props.store!.view.loading();
    const res = await admin.account.getList({
      pageSize: 30,
    });
    if (res.ok) {
      this.setState({ data: res.data.list });
    }
    this.props.store!.view.unLoading();
  };

  render() {
    return (
      <Page>
        <RouterPageHeader extra={<Button type="primary">添加</Button>}>
          <FormSearch onSub={v => console.log(v)}>
            {Item => (
              <>
                <Item label="测试" name="test" />
              </>
            )}
          </FormSearch>
        </RouterPageHeader>
        <AutoTable columns={this.columns} dataSource={this.state.data} scroll={{ x: 1100 }} />
        <Pagination size="small" total={100} onChange={(current, pageSize) => console.log(current, pageSize)} />
      </Page>
    );
  }
}
