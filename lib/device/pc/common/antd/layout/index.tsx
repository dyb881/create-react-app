import React, { useRef, useReducer } from 'react';
import { Layout as LayoutOld, ConfigProvider, BackTop, Spin, Drawer, Icon, PageHeader as PageHeaderOld } from 'antd';
import { PageHeaderProps } from 'antd/es/page-header';
import { MenuNav, TMenuProps } from '../menu';
import Media from 'react-media';
import classNames from 'classnames';

/**
 * 设置为中文简体
 */
import zh_CN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Header, Content, Sider } = LayoutOld;

type TProps = React.HTMLProps<HTMLDivElement> & {
  logo?: React.ReactNode;
  header?: React.ReactNode; // 顶部内容，默认右对齐
  loading?: boolean | string; // 在 Content 中显示加载状态
  menuData: TMenuProps['data']; // 菜单导航配置
  onClickItem?: TMenuProps['onClickItem'];
};

/**
 * 后台主体布局
 * 左侧 logo 和菜单导航，顶部信息栏
 */
export const Layout: React.SFC<TProps> = ({ logo, header, menuData, children, onClickItem }) => {
  const [{ key, drawer, show }, dispatch] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {
    key: 0,
    drawer: false,
    show: true,
  });

  // 菜单导航重复点击当前
  const reload = () => dispatch({ key: key + 1 });

  let sider = (
    <Sider className="dyb-layout-sider" collapsed={!show}>
      {logo || <div className="dyb-layout-logo" />}
      <MenuNav data={menuData} reload={reload} collapsed={!show} onClickItem={onClickItem} />
    </Sider>
  );

  if (drawer) {
    sider = (
      <Drawer
        placement="left"
        closable={false}
        width={200}
        className="dyb-drawer"
        visible={show}
        onClose={() => dispatch({ show: false })}
      >
        {sider}
      </Drawer>
    );
  }

  return (
    <ConfigProvider locale={zh_CN}>
      <LayoutOld className="dyb-layout">
        <Media
          query="(max-width: 600px)"
          onChange={matches => dispatch({ drawer: matches, show: matches ? false : show })}
        />
        <Media query="(max-width: 1000px)" onChange={matches => dispatch({ show: !matches })} />
        {sider}
        <LayoutOld>
          <Header className="dyb-layout-header">
            <Icon
              type={show ? 'menu-fold' : 'menu-unfold'}
              onClick={() => dispatch({ show: !show })}
              style={{ fontSize: 20, cursor: 'pointer' }}
            />
            <span>{header || '一定程度的限制，是为了更广阔的拓展'}</span>
          </Header>
          <Content className="dyb-layout-content" key={key}>
            {children}
          </Content>
        </LayoutOld>
      </LayoutOld>
    </ConfigProvider>
  );
};

export type TBoxProps = React.HTMLProps<HTMLDivElement> & {
  loading?: boolean | string; // 显示加载状态
};

/**
 * 布局盒子
 * 填满当前元素 + 滚动 + 回到顶部按钮 + antd Spin
 */
export const Box: React.SFC<TBoxProps> = ({ loading, ...props }) => {
  const box = useRef(null);
  return (
    <ConfigProvider getPopupContainer={() => box.current || document.body}>
      <div ref={box} className="dyb-layout-box">
        {box.current && <BackTop target={() => box.current!} />}
        <Spin spinning={!!loading} tip={typeof loading === 'string' ? loading : undefined}>
          <div {...props} />
        </Spin>
      </div>
    </ConfigProvider>
  );
};

/**
 * 头部模块
 * 在原有基础上追加 min-height: 32px
 */
export const PageHeader: React.SFC<PageHeaderProps> = ({ className, ...props }) => (
  <PageHeaderOld className={classNames('dyb-layout-pageHeader', className)} {...props} />
);

export default Layout;
