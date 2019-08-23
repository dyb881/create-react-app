import React, { useCallback, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { message } from 'antd';
import { useInfo, Page, RouterPageHeader, FormPage, Select, Radio } from 'components';
import { IPage } from 'types';
import { options } from './config';
import { admin } from 'api';

interface Params {
  id?: string;
}

const InfoPage: React.SFC<IPage<Params>> = ({ match, history }) => {
  const { id } = match.params;
  const { state, setData, setLoading } = useInfo({ state: 0 });
  const { data, loading } = state;

  /**
   * 根据 id 是否存在判断是否编辑页面，编辑页面需要执行请求数据
   */
  useEffect(() => {
    if (!id) return;
    const getData = async () => {
      setLoading('请求数据');
      const res = await admin.account.details(id);
      res.ok && setData(res.data);
      setLoading(false);
    };
    getData();
  }, []);

  /**
   * 提交数据
   */
  const onSub = useCallback(async (values: any) => {
    setLoading('提交数据');
    // --------------------------- 请求前处理提交数据 --------------------------- //
    if (id) values.id = id;
    // values
    // --------------------------- 请求前处理提交数据 --------------------------- //
    const res = await admin.account[id ? 'edit' : 'add'](values);
    setLoading(false);
    if (res.ok) {
      message.success(`${id ? '编辑' : '添加'}成功`);
      history.goBack();
    }
  }, []);

  return (
    <Page loading={loading}>
      <RouterPageHeader onBack={history.goBack} />
      <FormPage initialValues={data} onSub={onSub}>
        {Item => (
          <>
            <Item label="用户名" name="username" placeholder rules />
            <Item label="昵称" name="nickname" placeholder rules />
            <Item label="角色" name="role" placeholder rules select fill>
              <Select options={options.role} />
            </Item>
            {!id || (
              <>
                <Item label="注册IP">{data.regip}</Item>
                <Item label="登陆IP">{data.loginip}</Item>
                <Item label="注册时间">{data.regtime}</Item>
                <Item label="登陆时间">{data.logintime}</Item>
              </>
            )}
            <Item label="状态" name="state" fill>
              <Radio options={options.state} isButton />
            </Item>
          </>
        )}
      </FormPage>
    </Page>
  );
};

export default inject('store')(observer(InfoPage));
