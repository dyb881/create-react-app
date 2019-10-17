import React, { useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import { message } from 'antd';
import { RouterTitle, FormModalPage, Select, Radio } from 'components';
import { TStore } from 'types';
import { options } from './config';
import { admin } from 'api';

interface IProps extends TStore {
  data?: any; // 默认数据
}

const InfoModal: React.SFC<IProps> = ({ data, children }) => {
  /**
   * 提交数据
   */
  const onSub = useCallback(async (values: any) => {
    // --------------------------- 请求前处理提交数据 --------------------------- //
    if (data) values.id = data.id;
    // values
    // --------------------------- 请求前处理提交数据 --------------------------- //
    const res = await admin.account[data ? 'edit' : 'add'](values);
    if (res.ok) {
      message.success(`添加成功`);
      return true;
    }
  }, []);

  return (
    <FormModalPage
      title={<RouterTitle before={data ? '编辑' : '添加'} />}
      onSub={onSub}
      formProps={{ initialValues: data }}
    >
      {children}
      {Item => (
        <>
          <Item label="用户名" name="username" placeholder rules />
          <Item label="昵称" name="nickname" placeholder rules />
          <Item label="角色" name="role" placeholder rules select fill>
            <Select options={options.role} />
          </Item>
          <Item label="状态" name="state" fill initialValue={0}>
            <Radio options={options.state} isButton />
          </Item>
          {!data || (
            <>
              <Item label="注册IP">{data.regip}</Item>
              <Item label="登陆IP">{data.loginip}</Item>
              <Item label="注册时间">{data.regtime}</Item>
              <Item label="登陆时间">{data.logintime}</Item>
            </>
          )}
        </>
      )}
    </FormModalPage>
  );
};

export default inject('store')(observer(InfoModal));
