import React, { useState, useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Button, message } from 'antd';
import { Form, Password } from 'components';
import { TStore } from 'types';
import { sleep } from 'utils';
import style from './style.module.less';

const Page: React.SFC<TStore> = ({ store }) => {
  const [loading, setLoading] = useState<string | boolean>(false);

  /**
   * 提交数据
   */
  const onSub = useCallback(async (values: any) => {
    setLoading('正在登录');
    // --------------------------- 请求前处理提交数据 --------------------------- //
    // values
    console.log(values);
    // --------------------------- 请求前处理提交数据 --------------------------- //
    await sleep(1000);
    setLoading(false);
    message.success('登录成功');
    store!.user.onLogin(true);
  }, []);

  return (
    <div className="fill center">
      <div>
        <p className={style.title}>登录后台管理系统</p>
        <Form
          onSub={onSub}
          className={style.form}
          defaultItemProps={{
            width: 1,
          }}
        >
          {Item => (
            <>
              <Item label="" name="username" placeholder="请输入用户名" size="large" prefix={<Icon type="user" />} />
              <Item label="" name="password" placeholder="请输入密码" size="large" prefix={<Icon type="lock" />}>
                <Password />
              </Item>
              <Button htmlType="submit" size="large" type="primary" block loading={!!loading}>
                {loading || '登录'}
              </Button>
            </>
          )}
        </Form>
      </div>
    </div>
  );
};

export default inject('store')(observer(Page));
