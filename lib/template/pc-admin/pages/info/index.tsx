import React, { useMemo } from 'react';
import { FormItem, Select, TreeSelect } from 'common';
import { useTable, PageTable, FormSearch, usePreview, toThree } from 'components';
import { options, createColumns } from './config';
import { menu, info } from 'apis';

export default () => {
  const { preview, previewView } = usePreview();
  const { states, setStates, setData, pageTableProps, formSearchProps, del, DelButton } = useTable({
    onList: async ({ menuData, current, pageSize, search }) => {
      if (!menuData) {
        const res = await menu.getList();
        if (res.ok) {
          const menuData: any = {};
          let treeData = toThree(
            res.data.map(({ id, pid, title }: any) => {
              menuData[id] = title;
              return { id, pid, value: id, label: title };
            })
          );
          setStates({ menuData, treeData });
        }
      }

      const res = await info.getList({ current, pageSize, ...search });
      res.ok && setData(res.data.list, res.data.total);
    },
    onDel: async ids => {
      const res = await info.del(ids);
      return res.ok;
    },
  });
  const { treeData, menuData } = states;

  // 生成表格配置数据
  const columns = useMemo(() => createColumns({ del, preview, menuData }), [!menuData]);

  return (
    <PageTable {...pageTableProps} columns={columns} extra={<DelButton />} key={String(menuData)} add="/info/info">
      <FormSearch {...formSearchProps}>
        <FormItem label="所属菜单" name="menu_id" placeholder select required>
          <TreeSelect treeData={treeData} loading={!treeData} style={{ minWidth: 200 }} />
        </FormItem>
        <FormItem label="标题" name="title" placeholder />
        <FormItem label="简介" name="summary" placeholder />
        <FormItem label="内容" name="content" placeholder />
        <FormItem label="状态" name="status" placeholder select>
          <Select options={options.status} />
        </FormItem>
      </FormSearch>
      {previewView}
    </PageTable>
  );
};
