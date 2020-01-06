import { TRouters, TRoutersOptions, stores } from 'common';
import { TTabBars, TTabbarOptions, createTabBarPage } from 'components';

/**
 * 默认标题
 */
const defaultTitle = 'tabbar 模版';

/**
 * 写入标题
 * 根据页面变动把对应页面的 title 写入标题
 */
const setTitle = (title?: string) => {
  stores.view.setTitle(title || defaultTitle);
};

/**
 * tabbar 页面配置
 */
const tabBars: TTabBars = [
  { text: '首页', path: 'home' },
  { text: '我的', path: 'user', title: '用户中心' },
];

/**
 * tabbar 选项配置
 */
const tabbarOptions: TTabbarOptions = {
  transition: true,
  tabStyle: { fontSize: '.28rem' },
  activeStyle: { color: '#1890ff' },
  listen: ({ title }) => setTitle(title),
};

/**
 * 路由地址配置
 * 绑定组件路径 path，默认为 /src/pages 下的文件或文件夹
 */
export const routers: TRouters = [
  { to: '/', component: createTabBarPage(tabBars, tabbarOptions) },
  { to: '/user', path: 'user' },
];

/**
 * 路由选项配置
 */
export const routersOptions: TRoutersOptions = {
  transition: true,
  type: 'hash',
  listen: ({ title }) => setTitle(title),
};
