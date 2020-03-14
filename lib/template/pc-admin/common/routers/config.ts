import { TRouters, TRoutersOptions } from './';
import { stores } from '../stores';
import { getMenuNavDataRouters } from '../antd';
import { menuData } from './menu';
export * from './menu';

/**
 * 默认标题
 */
export const defaultTitle = 'RA Admin';

/**
 * 路由地址配置
 * 绑定组件路径 path，默认为 /src/pages 下的文件或文件夹
 */
export const routers: TRouters = [...getMenuNavDataRouters(menuData)];

/**
 * 路由选项配置
 */
export const routersOptions: TRoutersOptions = {
  type: 'hash',
  listen: ({ title }) => {
    stores.view.setTitle(title || defaultTitle);
  },
};
