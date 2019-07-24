import React from 'react';
import { Provider } from 'mobx-react';
import { HashRouter as Router } from 'react-router-dom';
import Store from 'store';
import Pages from 'pages';
import 'normalize.css';
import 'App.less';

/**
 * 初始化并缓存全局状态
 * 针对热更新友好，刷新文件时不会清空状态
 */
window.store = window.store || new Store();

/**
 * 状态初始化设置
 */
window.store.view.setTitle('项目名'); // 设置默认标题，可在页面内单独设置
window.store.user.onLogin(true); // 模拟登录，修改状态为已登录，并执行使用 onLogin(() => {}) 注册的方法

/**
 * 状态以及路由注入
 */
export default () => (
  <Provider store={window.store}>
    <Router>
      <Pages />
    </Router>
  </Provider>
);
