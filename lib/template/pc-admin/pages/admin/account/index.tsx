import React, { useMemo } from 'react';
import { Button } from 'antd';
import { FormItem } from 'common';
import { useTable, PageTable, FormSearch } from 'components';
import { admin } from 'apis';
import { createColumns } from './config';
import { useInfo } from './info_modal';

export default () => {
  const { states, setStates, setLoading, pageTableProps, formSearchProps } = useTable(async () => {
    setLoading('请求列表');
    const { current, pageSize, search } = states;
    // --------------------------- 请求前处理搜索值 --------------------------- //
    // search 建议展开避免副作用
    // --------------------------- 请求前处理搜索值 --------------------------- //
    const res = await admin.account.getList({ pageNum: current, pageSize, ...search });
    res.ok && setStates({ dataSource: res.data.list, total: res.data.total });
    setLoading(false);
  });

  // 弹窗表单
  const { modalForm, add, edit } = useInfo();

  // 生成表格配置数据
  const columns = useMemo(() => createColumns(edit), []);

  return (
    <PageTable
      {...pageTableProps}
      columns={columns}
      widthAddition={0}
      add="/admin/account/info"
      extra={<Button onClick={add}>弹窗添加</Button>}
    >
      <FormSearch {...formSearchProps}>
        <FormItem label="用户名" name="username" placeholder />
        <FormItem label="昵称" name="nickname" placeholder />
      </FormSearch>
      {modalForm}
    </PageTable>
  );
};
