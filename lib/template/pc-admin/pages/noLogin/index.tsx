import React from 'react';
import Routers from '@dyb881/router';

/**
 * 未登录页面路由
 */
const routersConfig = {
  '/login': require('./login').default,
};

export default () => <Routers routers={routersConfig} />;
