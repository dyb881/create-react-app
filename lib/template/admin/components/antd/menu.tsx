import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Menu as MenuOld, Icon } from 'antd';
import { MenuProps, ClickParam } from 'antd/es/menu';

const { SubMenu, Item } = MenuOld;

interface IData {
  title: string;
  icon?: string;
  child?: IData[];
  [key: string]: any;
}

export interface IMenuData extends IData {}

interface IProps extends MenuProps {
  data: IData[];
  onClickItem?: (data: any, key: string) => void;
}

export class Menu extends React.Component<IProps> {
  onClick = (param: ClickParam) => {
    const { onClickItem } = this.props;
    onClickItem && onClickItem(param.item.props['data-info'], param.key);
  };

  render() {
    const { data, onClickItem, ...props } = this.props;
    return (
      <MenuOld onClick={this.onClick} {...props}>
        {menuContent(data)}
      </MenuOld>
    );
  }
}

const menuContent = (data: IData[], prefix = '') =>
  data.map((i, k) => {
    const key = `item${prefix}${k}`;
    const title = (
      <>
        {i.icon && <Icon type={i.icon} />}
        <span>{i.title}</span>
      </>
    );
    return i.child ? (
      <SubMenu key={key} title={title}>
        {menuContent(i.child, prefix + k)}
      </SubMenu>
    ) : (
      <Item key={key} data-info={i}>
        {title}
      </Item>
    );
  });

interface IMenuNavProps extends IProps, RouteComponentProps {
  reload?: () => void;
}

interface IState {
  openKeys: string[];
  selectedKeys: string[];
}

class MenuNavOld extends React.Component<IMenuNavProps, IState> {
  state = {
    openKeys: [],
    selectedKeys: [],
  };

  componentDidMount() {
    this.onKeys();
  }

  getSnapshotBeforeUpdate(prevProps: IMenuNavProps) {
    return this.props.location.pathname !== prevProps.location.pathname;
  }

  componentDidUpdate(_prevProps: IMenuNavProps, _prevState: IState, isNewUrl: boolean) {
    isNewUrl && this.onKeys();
  }

  onKeys = () => {
    const [openKeys, selectedKey] = this.getKeys(this.props.location.pathname);
    this.setKeys(openKeys, selectedKey);
  };

  getKeys = (pathname: string, data = this.props.data, prefix = ''): [string[], string] => {
    let openKeys: string[] = [];
    let selectedKey: string = '';
    data.forEach((i, k) => {
      const key = `item${prefix}${k}`;
      if (!new RegExp(`^${i.to}`).test(pathname)) return;
      if (i.child) {
        openKeys.push(key);
        const [openKeys_, selectedKey_] = this.getKeys(pathname, i.child, prefix + k);
        openKeys.push(...openKeys_);
        if (selectedKey_) selectedKey = selectedKey_;
      } else {
        selectedKey = key;
      }
    });
    return [openKeys, selectedKey];
  };

  setKeys = (openKeys: string[], selectedKey: string) =>
    this.setState({
      openKeys: [...new Set([...this.state.openKeys, ...openKeys])],
      selectedKeys: [selectedKey],
    });

  onOpenChange = (openKeys: string[]) =>
    this.setState({
      openKeys,
    });

  onClickItem = (data: any) => {
    const { history, location, reload } = this.props;
    data.onClick && data.onClick();
    if (location.pathname === data.to) {
      reload ? reload() : window.location.reload();
    } else {
      history.push(data.to);
    }
  };

  render() {
    const { history, location, match, reload, staticContext, ...props } = this.props;
    return (
      <Menu
        {...this.state}
        onOpenChange={this.onOpenChange}
        mode="inline"
        theme="dark"
        {...props}
        onClickItem={this.onClickItem}
      />
    );
  }
}

/**
 * 左边导航栏
 */
export const MenuNav = withRouter(MenuNavOld);

export default Menu;
