import React from 'react';
import routers from 'config/routers';
import Router from '@dyb881/router';
import '@dyb881/router/lib/style.css';
import menuData from 'config/menuData';
import { Layout } from 'components';

/**
 * 全局布局以及路由注册
 */
export default class extends React.Component {
  render() {
    return (
      <Layout menuData={menuData}>
        <Router routers={routers} transition />
      </Layout>
    );
  }
}
