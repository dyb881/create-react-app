import React, { useState, useEffect, useCallback } from 'react';
import { Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, FormItem, Password, combine } from 'common';
import { Img } from 'components';
import { defaultTitle } from 'configs';
import style from './style.module.less';

export default combine(({ stores }) => {
  const { view, user } = stores;
  const [loading, setLoading] = useState<string | boolean>(false);

  /**
   * 提交数据
   */
  const onFinish = useCallback(async (values: any) => {
    setLoading('正在登录');
    // --------------------------- 请求前处理提交数据 --------------------------- //
    console.log(values);
    // --------------------------- 请求前处理提交数据 --------------------------- //
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    message.success('登录成功');
    user.login();
  }, []);

  useEffect(() => {
    view.setTitle(`登录 - ${defaultTitle}`);
  }, []);

  return (
    <div className="fill">
      <Img src={require('images/login_bg.jpg')} mode={['aspectFill', 'center']} className="fill" />
      <div className={`column-center ${style.formBox}`}>
        <img src={require('images/logo.ico')} alt="" />
        <p>{defaultTitle}</p>
        <Form className={style.form} onFinish={onFinish}>
          <FormItem name="username" prefix={<UserOutlined />} size="large" placeholder="请输入用户名" required />
          <FormItem name="password" prefix={<LockOutlined />} size="large" placeholder="请输入密码" required>
            <Password />
          </FormItem>
          <Button htmlType="submit" type="primary" block size="large" loading={!!loading}>
            {loading || '登录'}
          </Button>
        </Form>
      </div>
    </div>
  );
});