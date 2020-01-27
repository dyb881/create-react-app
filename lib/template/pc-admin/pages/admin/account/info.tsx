import React from 'react';
import { message } from 'antd';
import { FormItem, Select, Radio, combinePage } from 'common';
import { PageForm, useInfo } from 'components';
import { options } from './config';
import { admin } from 'apis';

type TParams = { id?: string };

export default combinePage<TParams>(({ history, match }) => {
  const { id } = match.params;
  const { data, setData, setLoading, pageFormProps } = useInfo({
    defaultData: { state: 0 },
    getData: async () => {
      if (!id) return;
      setLoading('请求数据');
      const res = await admin.account.details(id);
      res.ok && setData(res.data);
      setLoading(false);
    },
    onFinish: async (values: any) => {
      setLoading('正在保存');
      // --------------------------- 请求前处理提交数据 --------------------------- //
      // values 建议展开避免副作用
      // --------------------------- 请求前处理提交数据 --------------------------- //
      if (id) values.id = id; // 编辑时需要带入 ID
      const res = await admin.account[id ? 'edit' : 'add'](values);
      if (!res.ok) return setLoading(false);
      message.success(`${id ? '编辑' : '新建'}成功`);
      history.goBack();
    },
  });

  return (
    <PageForm {...pageFormProps}>
      <FormItem label="用户名" name="username" placeholder />
      <FormItem label="昵称" name="nickname" placeholder />
      <FormItem label="角色" name="role" placeholder select>
        <Select options={options.role} />
      </FormItem>
      {!id || (
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
    </PageForm>
  );
});
