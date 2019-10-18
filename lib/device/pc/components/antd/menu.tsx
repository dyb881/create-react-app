import React, { useReducer, useEffect, useMemo } from 'react';
import { matchPath, useLocation, useHistory } from 'react-router-dom';
import { Menu as MenuOld, Icon } from 'antd';
import { MenuProps, ClickParam } from 'antd/es/menu';

const { SubMenu, Item } = MenuOld;

export type TMenuData = {
  to?: string; // 跳转地址
  icon?: React.ReactNode;
  title: string; // 标题
  onClick?: () => void; // 点击事件
  child?: TMenuData[]; // 子菜单
  hidden?: boolean; // 隐藏当前项
  [key: string]: any;
};

export type TMenuProps = MenuProps & {
  data: TMenuData[]; // 导航菜单配置数据
  onClickItem?: (data: TMenuData, key: string) => void; // 点击导航菜单 item 时执行
  collapsed?: boolean; // 是否隐藏状态
};

/**
 * 递归树状的导航菜单
 * 根据配置，可无限生成子菜单
 */
export const Menu: React.SFC<TMenuProps> = ({ data, onClickItem, collapsed, openKeys, onOpenChange, ...props }) => {
  const onClick = (param: ClickParam) => onClickItem!(param.item.props['data-info'], param.key);
  const children = useMemo(() => menuContent(data), [JSON.stringify(data)]);
  const computeProps = collapsed ? {} : { openKeys, onOpenChange };

  return (
    <MenuOld {...computeProps} onClick={onClickItem ? onClick : undefined} {...props}>
      {children}
    </MenuOld>
  );
};

/**
 * 递归生成子菜单
 */
const menuContent = (data: TMenuData[], prefix = '') =>
  data
    .filter(i => !i.hidden)
    .map((i, k) => {
      const key = `item${prefix}${k}`;
      const title = (
        <>
          {typeof i.icon === 'string' ? <Icon type={i.icon} /> : i.icon}
          <span>{i.title}</span>
        </>
      );
      return i.child && i.child.some(i => !i.hidden) ? (
        <SubMenu key={key} title={title}>
          {menuContent(i.child, prefix + k)}
        </SubMenu>
      ) : (
        <Item key={key} data-info={i}>
          {title}
        </Item>
      );
    });

export type TMenuNavProps = TMenuProps & {
  reload?: () => void; // 刷新
  onEmpty?: () => void; // 空地址
};

/**
 * 左边导航栏
 * 根据路由自动打开并选中菜单
 */
export const MenuNav: React.SFC<TMenuNavProps> = ({ reload, ...props }) => {
  const history = useHistory();
  const location = useLocation();

  const [state, dispatch] = useReducer(
    (state, newState) => {
      const { type, openKeys, selectedKey } = newState;
      return type === 'AUTO_OPEN_SELECT'
        ? { openKeys: [...new Set([...state.openKeys, ...openKeys])], selectedKeys: [selectedKey] }
        : { ...state, ...newState };
    },
    { openKeys: [], selectedKeys: [] }
  );

  useEffect(() => {
    // 当前选中
    let selectedKey = '';

    const getOpenKeys = (data: TMenuData[], prefix = ''): string[] | false => {
      // 默认没有被选中
      let openKeys: string[] | false = false;
      data.forEach((i, k) => {
        const key = `item${prefix}${k}`;
        // 匹配当前地址
        if (matchPath(location.pathname, { path: i.to, exact: true })) {
          if (!i.hidden) {
            // 选中
            selectedKey = key;
          }
          // 确定当前路径被选中
          openKeys = [];
        } else if (i.child) {
          const openKeys_ = getOpenKeys(i.child, prefix + k);
          // 根据选中路径，往上寻找并打开菜单
          if (openKeys_) openKeys = [key, ...openKeys_];
          // 选中
          if (!selectedKey) selectedKey = key;
        }
      });
      return openKeys;
    };

    // 需要打开的菜单
    const openKeys = getOpenKeys(props.data);

    // 执行 自动打开菜单并选中
    dispatch({ type: 'AUTO_OPEN_SELECT', openKeys: openKeys || [], selectedKey });
  }, [location.pathname, JSON.stringify(props.data)]);

  const onOpenChange = (openKeys: string[]) => dispatch({ openKeys });

  const onClickItem = (data: TMenuData, key: string) => {
    props.onClickItem && props.onClickItem(data, key);
    data.onClick && data.onClick();
    if (location.pathname === data.to) {
      // 跳转地址和当前地址相同，执行刷新
      reload && reload();
    } else {
      // 跳转对应地址
      data.to && history.push(data.to);
    }
  };

  return (
    <Menu {...state} onOpenChange={onOpenChange} mode="inline" theme="dark" {...props} onClickItem={onClickItem} />
  );
};

export default Menu;
