import React, { useEffect, useMemo, useCallback } from 'react';
import { useLocation, useHistory, matchPath } from 'react-router-dom';
import { Menu, TMenuData, TMenuProps, TRouters, useStates } from 'common';

export type TMenuNavData = Pick<TMenuData, 'icon' | 'title'> & {
  to?: string; // 路由地址
  path?: string; // 绑定组件路径，为空时会尝试使用 to 的路径
  hidden?: boolean; // 不展示到导航菜单
  children?: TMenuNavData[];
};

export type TMenuNavProps = Omit<TMenuProps, 'data'> & {
  data: TMenuNavData[]; // 导航菜单配置数据，生成菜单后一般无法更改，如果需要更改请在 Menu Props 加上 key
  reload?: () => void; // 刷新
};

/**
 * 导航栏
 * 根据路由自动打开并选中菜单
 */
export const MenuNav: React.FC<TMenuNavProps> = ({ reload, data, ...props }) => {
  const { push } = useHistory();
  const { pathname } = useLocation();
  const { states, setStates } = useStates({ openKeys: [], selectedKeys: [] });

  const menuNavData = useMemo(() => menuNavDataHidden(data), []);

  /**
   * 点击菜单执行事件并跳转页面
   */
  const onClickItem: TMenuProps['onClickItem'] = (data, key, param) => {
    props.onClickItem && props.onClickItem(data, key, param);
    if (pathname === data.to) {
      reload && reload(); // 跳转地址和当前地址相同，执行刷新
    } else {
      data.to && push(data.to); // 跳转对应地址
    }
  };

  /**
   * 菜单开关
   */
  const onOpenChange = useCallback((openKeys: string[]) => setStates({ openKeys }), []);

  /**
   * 监听路由变动，打开和选中菜单项
   */
  useEffect(() => {
    let selectedKey = '';
    const openKeys = [...states.openKeys];

    const getOpenKeys = (data: TMenuNavData[], prefix = 'key') => {
      let isSelect = false; // 该路线是否选中

      data.forEach((i, k) => {
        const key = `${prefix}-${k}`;
        if (matchPath(pathname, { path: i.to, exact: true })) {
          selectedKey = key; // 选中
          isSelect = true;
        } else if (i.children?.length) {
          isSelect = getOpenKeys(i.children, key);
          // 路线被选中，并且未打开，则 push key
          isSelect && !openKeys.includes(key) && openKeys.push(key);
        }
      });

      return isSelect;
    };

    getOpenKeys(data);
    setStates({ openKeys, selectedKeys: [selectedKey] });
  }, [pathname]);

  return (
    <Menu
      {...props}
      {...states}
      onOpenChange={onOpenChange}
      data={menuNavData as TMenuData[]}
      onClickItem={onClickItem}
    />
  );
};

/**
 * 隐藏数据中 hidden === true 的项
 */
export const menuNavDataHidden = (data: TMenuNavData[]) => {
  return data
    .filter(i => !i.hidden)
    .map(i => {
      if (i.children) i = { ...i, children: menuNavDataHidden(i.children) };
      return i;
    });
};

/**
 * 获取导航数据中路由信息
 */
export const getMenuNavDataRouters = (data: TMenuNavData[]) => {
  let routers: TRouters = [];
  for (let { to, path, title, children } of data) {
    to && routers.push({ to, path: path || to.slice(1).split('/:')[0], title });
    if (children) routers = [...routers, ...getMenuNavDataRouters(children)];
  }
  return routers;
};

/**
 * 获取导航数据中路由地址匹配的标题
 */
export const getMenuNavDataTitle = (data: TMenuNavData[], pathname: string) => {
  let menuNavDatatitle = '';
  data.forEach(({ to, title, children }) => {
    if (matchPath(pathname, { path: to, exact: true })) {
      menuNavDatatitle = title;
    } else if (!menuNavDatatitle && children?.length) {
      menuNavDatatitle = getMenuNavDataTitle(children, pathname);
    }
  });
  return menuNavDatatitle;
};

/**
 * 获取导航数据中路由地址匹配的数组
 */
export const getMenuNavDatas = (data: TMenuNavData[], pathname: string) => {
  let menuNavDatas: TMenuNavData[] = [];
  data.forEach(i => {
    const { to, children } = i;
    if (matchPath(pathname, { path: to, exact: true })) {
      menuNavDatas.push(i);
    } else if (children?.length) {
      const childrenMenuNavDatas = getMenuNavDatas(children, pathname);
      childrenMenuNavDatas.length && menuNavDatas.push(i, ...childrenMenuNavDatas);
    }
  });
  return menuNavDatas;
};
