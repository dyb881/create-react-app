import { getMenuRouters } from './menuData';

/**
 * 路由绑定组件路径
 * 默认为 /src/pages 下的文件或文件夹
 */
export type TRouters = {
  // 路由地址：绑定组件路径
  [path: string]: string;
};

const routersPaths: TRouters = {
  ...getMenuRouters(), // 菜单信息中解析路由
};

/**
 * 路由配置
 */
const routers = Object.keys(routersPaths).reduce(
  (routers, path) => {
    const page = require('pages/' + routersPaths[path]).default;
    routers[path] = page;
    return routers;
  },
  {} as {
    [key: string]: React.ComponentType<any>;
  }
);

export default routers;
