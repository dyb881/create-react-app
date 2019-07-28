import React, { useRef, useReducer } from 'react';
import { Layout as LayoutOld, ConfigProvider, BackTop, Spin, PageHeader as PageHeaderOld } from 'antd';
import { PageHeaderProps } from 'antd/es/page-header';
import LocaleProvider from '../locale_provider';
import { MenuNav, IMenuData } from '../menu';
import Media from 'react-media';
import classNames from 'classnames';

const { Header, Content, Sider } = LayoutOld;

interface IProps extends React.HTMLProps<HTMLDivElement> {
  logo?: React.ReactNode;
  header?: React.ReactNode; // 顶部内容，默认右对齐
  loading?: boolean | string; // 在 Content 中显示加载状态
  menuData: IMenuData[]; // 菜单导航配置
}

/**
 * 后台主体布局
 * 左侧 logo 和菜单导航，顶部信息栏
 */
export const Layout: React.SFC<IProps> = ({ logo, header, loading, menuData, ...props }) => {
  const box = useRef(null);
  const [state, dispatch] = useReducer((state, newState) => ({ ...state, ...newState }), { key: 0, collapsed: false });
  const { key, collapsed } = state;

  // 菜单导航重复点击当前
  const reload = () => dispatch({ key: key + 1 });

  // 菜单导航关闭展开
  const setCollapsed = (collapsed: boolean) => dispatch({ collapsed });

  return (
    <LocaleProvider>
      <LayoutOld className="dyb-layout">
        <Media query="(max-width: 1000px)" onChange={setCollapsed} />
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          {logo || <div className="dyb-layout-logo" />}
          <MenuNav data={menuData} reload={reload} key={+collapsed} />
        </Sider>
        <LayoutOld>
          <Header className="dyb-layout-header">{header || '一定程度的限制，是为了更广阔的拓展'}</Header>
          <Content className="dyb-layout-content">
            <ConfigProvider getPopupContainer={() => box.current || document.body}>
              <div ref={box} className="dyb-layout-box">
                {box.current && <BackTop target={() => box.current!} />}
                <Spin spinning={!!loading} tip={typeof loading === 'string' ? loading : undefined}>
                  <div key={key} {...props} />
                </Spin>
              </div>
            </ConfigProvider>
          </Content>
        </LayoutOld>
      </LayoutOld>
    </LocaleProvider>
  );
};

/**
 * 头部模块
 * 在原有基础上追加 min-height: 80px
 */
export const PageHeader: React.SFC<PageHeaderProps> = ({ className, ...props }) => (
  <PageHeaderOld className={classNames('dyb-layout-pageHeader', className)} {...props} />
);

export default Layout;
