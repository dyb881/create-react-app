import React from 'react';
import routers from 'config/routers';
import Router from '@dyb881/router';
import '@dyb881/router/lib/style.css';
import autoRem from '@dyb881/auto-rem';

// 自动 rem
autoRem(320, 750, true);

/**
 * 全局布局以及路由注册
 */
export default class extends React.Component {
  render() {
    return <Router routers={routers} transition />;
  }
}
