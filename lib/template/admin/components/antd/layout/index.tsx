import React from 'react';
import { Layout as LayoutOld, ConfigProvider, Spin, PageHeader as PageHeaderOld, BackTop } from 'antd';
import { PageHeaderProps } from 'antd/es/page-header';
import LocaleProvider from '../locale_provider';
import { MenuNav, IMenuData } from '../menu';
import Media from 'react-media';

const { Header, Content, Sider } = LayoutOld;

interface IProps {
  logo?: React.ReactNode;
  header?: React.ReactNode;
  menuData: IMenuData[];
}

interface IState {
  key: number;
  collapsed: boolean;
}

export class Layout extends React.Component<IProps, IState> {
  state = { key: 0, collapsed: false };

  reload = () => this.setState({ key: this.state.key + 1 });

  onCollapse = (collapsed: boolean) => this.setState({ collapsed });

  render() {
    const { key, collapsed } = this.state;
    const { logo, header, menuData, children } = this.props;
    return (
      <LocaleProvider>
        <LayoutOld className="dyb-layout">
          <Media query="(max-width: 1000px)" onChange={this.onCollapse} />
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            {logo || <div className="dyb-layout-logo" />}
            <MenuNav data={menuData} reload={this.reload} key={+collapsed} />
          </Sider>
          <LayoutOld>
            <Header className="dyb-layout-header">{header || '一定程度的限制，是为了更广阔的拓展'}</Header>
            <Content className="dyb-layout-content" key={key}>
              {children}
            </Content>
          </LayoutOld>
        </LayoutOld>
      </LocaleProvider>
    );
  }
}

interface IBoxProps extends React.HTMLProps<HTMLDivElement> {
  loading?: boolean | string;
}

interface IBoxState {
  box?: HTMLDivElement;
}

export class Box extends React.Component<IBoxProps, IBoxState> {
  state = { box: undefined };

  onRef = (box: any) => !this.state.box && box && this.setState({ box });

  render() {
    const { loading = false, className, children, ...props } = this.props;
    const { box } = this.state;
    return (
      <ConfigProvider getPopupContainer={() => box!}>
        <div ref={this.onRef} className={['dyb-layout-box', className].join(' ')} {...props}>
          {box && <BackTop target={() => box!} />}
          <Spin spinning={!!loading} tip={typeof loading === 'string' ? loading : undefined}>
            <div className="dyb-layout-box-main">{children}</div>
          </Spin>
        </div>
      </ConfigProvider>
    );
  }
}

interface IBoxItemProps extends React.HTMLProps<HTMLDivElement> {
  title?: string;
}

/**
 * 单格
 */
export const BoxItem: React.SFC<IBoxItemProps> = ({ title, children, ...props }) => (
  <div className="dyb-layout-box-item" {...props}>
    {title && <div className="dyb-layout-box-item-title">{title}</div>}
    {children}
  </div>
);

/**
 * 头部模块
 */
export const PageHeader: React.SFC<PageHeaderProps> = ({ className, ...props }) => (
  <PageHeaderOld className={['dyb-layout-pageHeader', className].join(' ')} {...props} />
);

export default Layout;
