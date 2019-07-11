import React from 'react';
import { Provider } from 'mobx-react';
import { HashRouter as Router } from 'react-router-dom';
import Store from 'store';
import Pages from 'pages';
import 'normalize.css';
import 'App.less';

// 初始化并缓存全局状态，热更新友好
window.store = window.store || new Store();
const store = window.store as Store;

// 状态初始化设置
store.view.setTitle('项目名'); // 设置标题
store.user.onLogin(true); // 模拟登录

/**
 * 状态以及路由注入
 */
export default () => (
  <Provider store={store}>
    <Router>
      <Pages />
    </Router>
  </Provider>
);
