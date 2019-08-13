import React, { useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';
import { useTable, Page, RouterPageHeader, FormSearch, AutoTable, Pagination } from 'components';
import { IStore } from 'types';
import { createTableProps } from './config';
import { admin } from 'api';

const TablePage: React.SFC<IStore> = ({ store }) => {
  const tablePageKey = 'root'; // 表格页面数据储存的 key
  const { view } = store!;
  const { state, dispatch, use, formSearchProps, paginationProps } = useTable({
    page: view.getKey(tablePageKey), // 表格页面数据
    onPage: page => view.setKey(tablePageKey, page), // 写入表格页面数据
    defaultSearch: {
      username: 'admin',
    },
  });

  /**
   * 获取状态，可以直接获取未定义的状态,并设置默认值 const { newStateItem = defaultData } = state;
   */
  const { current, pageSize, dataSource } = state;

  /**
   * 请求列表数据
   */
  const getList = useCallback(async () => {
    view.loading();
    // 获取搜索值并执行展开，避免副作用
    const search = { ...state.search };
    // --------------------------- 请求前处理搜索值 --------------------------- //
    // search
    // --------------------------- 请求前处理搜索值 --------------------------- //
    const res = await admin.account.getList({ pageNum: current, pageSize, ...search });
    res.ok && dispatch({ dataSource: res.data.list, total: res.data.total });
    view.unLoading();
  }, use);

  /**
   * 根据监听条件自动请求最新列表
   */
  useEffect(() => {
    getList();
  }, use);

  /**
   * 生成表格配置数据
   */
  const tableProps = useMemo(() => createTableProps(), []);

  /**
   * 右上角按钮及内容
   */
  const extra = (
    <>
      <Link to="/admin/account/info">
        <Button type="primary">添加</Button>
      </Link>
    </>
  );

  return (
    <Page>
      <RouterPageHeader extra={extra}>
        <FormSearch {...formSearchProps} refresh={getList}>
          {Item => (
            <>
              <Item label="用户名" name="username" placeholder />
              <Item label="昵称" name="nickname" placeholder />
            </>
          )}
        </FormSearch>
      </RouterPageHeader>
      <AutoTable {...tableProps} dataSource={dataSource} />
      <Pagination {...paginationProps} />
    </Page>
  );
};

export default inject('store')(observer(TablePage));
