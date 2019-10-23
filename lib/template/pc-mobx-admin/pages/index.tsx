import React, { useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import Router from '@dyb881/router';
import '@dyb881/router/lib/style.css';
import Transition from '@dyb881/transition';
import '@dyb881/transition/lib/style.css';
import { Layout, Header } from 'components';
import { TStore } from 'types';
import { menuData, routers } from 'config';
import Login from './login';

/**
 * 全局布局以及路由注册
 */
const Pages: React.SFC<TStore> = ({ store }) => {
  const { view, user } = store!;

  /**
   * 点击左侧导航菜单
   */
  const onClickItem = useCallback(() => {
    view.setKey('root', {}); // 清空表格页数据
  }, []);

  return (
    <Transition name="fade">
      {user.isLogin ? (
        <Layout key="layout" menuData={menuData} header={<Header />} onClickItem={onClickItem}>
          <Router routers={routers} transition />
        </Layout>
      ) : (
        <Login key="login" />
      )}
    </Transition>
  );
};

export default inject('store')(observer(Pages));
