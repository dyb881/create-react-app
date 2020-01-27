import { TRouters, TRoutersOptions, stores } from 'common';
import { getMenuNavDataRouters } from 'components';
import { menuNavData } from 'configs';

/**
 * 默认标题
 */
export const defaultTitle = 'RA Admin';

/**
 * 路由地址配置
 * 绑定组件路径 path，默认为 /src/pages 下的文件或文件夹
 */
export const routers: TRouters = [...getMenuNavDataRouters(menuNavData)];

/**
 * 路由选项配置
 */
export const routersOptions: TRoutersOptions = {
  type: 'hash',
  listen: ({ title }) => {
    stores.view.setTitle(title ? `${title} - ${defaultTitle}` : defaultTitle);
  },
};
