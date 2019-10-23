import React from 'react';
import Router from '@dyb881/router';
import '@dyb881/router/lib/style.css';
import autoRem from '@dyb881/auto-rem';
import { TitleMonitor } from 'components';
import { routers } from 'config';

/**
 * 自动 rem
 * 以 100px 为基准，相对 750 进行计算
 */
autoRem(320, 750, true);

/**
 * 全局布局以及路由注册
 */
export default () => (
  <>
    <Router routers={routers} transition app />
    <TitleMonitor />
  </>
);
