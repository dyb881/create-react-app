import React, { useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import routers from 'config/routers';
import Router from '@dyb881/router';
import '@dyb881/router/lib/style.css';
import menuData from 'config/menuData';
import { Layout, Header, Loading } from 'components';
import { IStore } from 'types';

/**
 * 全局布局以及路由注册
 */
const Pages: React.SFC<IStore> = ({ store }) => {
  /**
   * 点击左侧导航菜单
   */
  const onClickItem = useCallback(() => {
    store!.view.setKey('root', {}); // 清空表格页数据
  }, []);

  return (
    <Layout menuData={menuData} header={<Header />} onClickItem={onClickItem}>
      <Router routers={routers} transition />
      <Loading />
    </Layout>
  );
};

export default inject('store')(observer(Pages));
