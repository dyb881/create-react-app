import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { Layout } from 'components';
import { Router, Pages, combine } from 'common';
import Login from 'pages/login';

/**
 * Router 用于注册基础路由
 * Pages 路由页面集合
 */
const App = combine(({ stores }) => {
  const { showLogin, autoLogin } = stores.user;

  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <Router>
      {showLogin ? (
        <Login />
      ) : (
        <Layout>
          <Pages />
        </Layout>
      )}
    </Router>
  );
});

// 热更新
export default process.env.NODE_ENV === 'development' ? hot(App) : App;
