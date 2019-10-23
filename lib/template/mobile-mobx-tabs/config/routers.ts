/**
 * 路由绑定组件路径
 */
export type TRoutersConfig = {
  title: string; // 页面标题
  to: string; // 路由地址
  path: string; // 绑定组件路径，默认为 /src/pages 下的文件或文件夹
};

export const routersConfig: TRoutersConfig[] = [
  {
    title: '首页',
    to: '/',
    path: 'tabs',
  },
  {
    title: '列表',
    to: '/list',
    path: 'list',
  },
];

/**
 * 路由配置生成
 */
export const routers = routersConfig.reduce(
  (routers, router) => {
    const page = require('pages/' + router.path).default;
    routers[router.to] = page;
    return routers;
  },
  {} as {
    [key: string]: React.ComponentType<any>;
  }
);