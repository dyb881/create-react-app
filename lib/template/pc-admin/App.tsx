import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Router, Pages } from 'common/routers'; // 直接引用 common 会导致循环引用，build 后运行报错
import { combine } from 'common/stores'; // 直接引用 common 会导致循环引用，build 后运行报错
import { LayoutBox } from 'components';
import Login from 'pages/login'; // 未登录页面
import 'common/style'; // 默认全局样式

/**
 * Router 用于注册基础路由
 * Pages 路由页面集合
 */
const App = combine(({ stores }) => {
  const { showLogin } = stores.user;

  return (
    <Router>
      {showLogin ? (
        <Login />
      ) : (
        <LayoutBox>
          <Pages />
        </LayoutBox>
      )}
    </Router>
  );
});

// 热更新
export default process.env.NODE_ENV === 'development' ? hot(App) : App;
