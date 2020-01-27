import React from 'react';
import { message } from 'antd';
import { FormItem, Select, Radio } from 'common';
import { RouterTitle, FormModal, useInfoModal } from 'components';
import { options } from './config';
import { admin } from 'apis';

export const useInfo = () => {
  const { formModalProps, data, isEdit, setLoading, hide, ...funs } = useInfoModal({
    defaultData: { state: 0 },
    onFinish: async (values: any) => {
      setLoading(true);
      // --------------------------- 请求前处理提交数据 --------------------------- //
      // values 建议展开避免副作用
      // --------------------------- 请求前处理提交数据 --------------------------- //
      if (isEdit) values.id = data.id; // 编辑时需要带入 ID
      const res = await admin.account[data ? 'edit' : 'add'](values);
      if (!res.ok) return setLoading(false);
      message.success(`${isEdit ? '编辑' : '新建'}成功`);
      hide();
    },
  });

  const modalForm = (
    <FormModal title={<RouterTitle before={isEdit ? '编辑' : '新建'} />} {...formModalProps}>
      <FormItem label="用户名" name="username" placeholder />
      <FormItem label="昵称" name="nickname" placeholder />
      <FormItem label="角色" name="role" placeholder select>
        <Select options={options.role} />
      </FormItem>
      {isEdit && (
        <>
          <FormItem label="注册IP">{data.regip}</FormItem>
          <FormItem label="登陆IP">{data.loginip}</FormItem>
          <FormItem label="注册时间">{data.regtime}</FormItem>
          <FormItem label="登陆时间">{data.logintime}</FormItem>
        </>
      )}
      <FormItem label="状态" name="state">
        <Radio options={options.state} />
      </FormItem>
    </FormModal>
  );

  return { modalForm, ...funs };
};
