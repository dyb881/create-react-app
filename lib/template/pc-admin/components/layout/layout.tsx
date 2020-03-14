import React, { useRef, useCallback } from 'react';
import { ConfigProvider, Layout as LayoutSource, Avatar, Tooltip, BackTop } from 'antd';
import { UserOutlined, PoweroffOutlined, MobileOutlined } from '@ant-design/icons';
import { defaultTitle, MenuNav, menuData, combine } from 'common';
import { Interval, Fullscreen, MenuSwitch } from './common';
import { Setting } from './setting';
import { RouterBreadcrumb } from './router_component';
import { Preview } from './preview';
import classNames from 'classnames';
import style from './style.module.less';

/**
 * 设置为中文简体
 */
import zh_CN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Sider, Header, Content } = LayoutSource;

/**
 * 主体布局
 */
export const Layout: React.FC = combine(({ stores, children }) => {
  const box = useRef(null);
  const { isMobile, collapsed, collapsedChange, showHeader, showHeaderChange, setting } = stores.layout;
  const { theme, hiddenMenu, hiddenHeader, menuIconTop, headerIconRight, componentSize } = setting;
  const isCollapsed = !(isMobile || hiddenMenu) && collapsed;
  const menuSwitchProps = { open: (isMobile || hiddenMenu) !== collapsed, onClick: collapsedChange };

  // 清空表格页数据
  const onClickItem = useCallback(() => stores.view.setTableData('root'), []);

  return (
    <ConfigProvider locale={zh_CN} componentSize={componentSize} getPopupContainer={() => box.current || document.body}>
      <LayoutSource className={classNames('fill', style[componentSize])}>
        <Sider
          className={classNames(style.sider, { [style.hidden]: (isMobile || hiddenMenu) && !collapsed })}
          collapsed={isCollapsed}
          theme={theme}
        >
          <div className={`center ${style.top}`}>
            <img src={require('images/logo.ico')} alt="" className="transition" />
            {isCollapsed || <h1 className="transition">{defaultTitle}</h1>}
          </div>
          {hiddenHeader && (
            <MenuSwitch
              className={`center transition ${style.menuIcon}`}
              style={{ top: menuIconTop }}
              {...menuSwitchProps}
            />
          )}
          <MenuNav
            data={menuData}
            mode="inline"
            inlineCollapsed={isCollapsed}
            theme={theme}
            onClickItem={onClickItem}
          />
        </Sider>
        <LayoutSource>
          <Header
            className={classNames(`transition ${style.header}`, {
              [style.hidden]: hiddenHeader && !showHeader,
            })}
          >
            <div className="between-center">
              <Interval left>
                {(isMobile || hiddenMenu) && <img src={require('images/logo.ico')} alt="" className={style.logo} />}
                {hiddenHeader || <MenuSwitch {...menuSwitchProps} />}
              </Interval>
              <Interval>
                <Avatar icon={<UserOutlined />} size="small" />
                <span style={{ fontSize: 14 }}>用户名</span>
                <Fullscreen />
                <Setting />
                <Tooltip placement="bottom" title="注销">
                  <PoweroffOutlined className="pointer" onClick={stores.user.logoutConfirm} />
                </Tooltip>
              </Interval>
              {hiddenHeader && (
                <div
                  className={`transition ${style.showHeader}`}
                  onClick={showHeaderChange}
                  style={{ right: headerIconRight }}
                >
                  <MobileOutlined className={style.icon} />
                </div>
              )}
            </div>
          </Header>
          <Content className={style.content}>
            <div className="page" ref={box}>
              <RouterBreadcrumb />
              {children}
              {box.current && <BackTop target={() => box.current!} style={{ right: 50 }} />}
            </div>
          </Content>
        </LayoutSource>
        <Preview />
      </LayoutSource>
    </ConfigProvider>
  );
});
