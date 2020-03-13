import React, { useState } from 'react';
import { FormItem, Radio, TextArea, InputNumber, TreeSelect } from 'common';
import { RouterTitle, FormModal, useInfoModal, UploadInput, toThree, treeDisabled } from 'components';
import { options } from './config';
import { menu } from 'apis';

export const useInfo = (getList: () => void) => {
  const [treeData, setTreeData] = useState<any>();
  const { formModalProps, data, isEdit, ...funs } = useInfoModal({
    getList,
    defaultData: { priority: 0, status: 1 },
    getData: async () => {
      const res = await menu.getList();
      if (!res.ok) return;
      let treeData = toThree(res.data.map(({ id, pid, title }: any) => ({ id, pid, value: id, label: title })));
      if (isEdit) treeData = treeDisabled(treeData, data.id);
      setTreeData(treeData);
    },
    onSubmit: async (values: any) => {
      if (isEdit) values.id = data.id;
      const res = await menu[isEdit ? 'edit' : 'add'](values);
      return res.ok;
    },
  });

  const modalForm = (
    <FormModal title={<RouterTitle before={isEdit ? '编辑' : '新建'} />} {...formModalProps}>
      <FormItem label="所属菜单" name="pid" placeholder="不选则作为根菜单">
        <TreeSelect treeData={treeData} loading={!treeData} />
      </FormItem>
      <FormItem label="标题" name="title" placeholder required />
      <FormItem label="内容" name="content" placeholder>
        <TextArea />
      </FormItem>
      <FormItem label="图标" name="icon">
        <UploadInput />
      </FormItem>
      <FormItem label="优先级" name="priority" required>
        <InputNumber />
      </FormItem>
      <FormItem label="状态" name="status">
        <Radio options={options.status} />
      </FormItem>
    </FormModal>
  );

  return { modalForm, ...funs };
};
