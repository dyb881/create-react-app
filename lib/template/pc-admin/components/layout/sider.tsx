import React from 'react';
import { Layout } from 'antd';
import { combine } from 'common';
import { defaultTitle, menuNavData } from 'configs';
import { MenuNav, TMenuNavProps } from './menu_nav';
import classNames from 'classnames';
import style from './style.module.less';
import { MenuSwitch } from './header';

export const Sider = combine<Partial<TMenuNavProps>>(({ stores, ...props }) => {
  const { isMobile, pageConfig, collapsed } = stores.view;
  const isCollapsed = !isMobile && collapsed;
  const { theme, hiddenHeader, menuIconTop } = pageConfig;

  return (
    <Layout.Sider
      className={classNames(style.sider, { [style.hidden]: isMobile && !collapsed })}
      collapsed={isCollapsed}
      theme={theme}
    >
      <div className={`center transition ${style.logo}`}>
        <img src={require('images/logo.ico')} alt="" className="transition" />
        <h1 hidden={isCollapsed} className="transition">
          {defaultTitle}
        </h1>
      </div>
      <MenuNav data={menuNavData} mode="inline" inlineCollapsed={isCollapsed} theme={theme} {...props} />
      {hiddenHeader && <MenuSwitch className={`center transition ${style.menuIcon}`} style={{ top: menuIconTop }} />}
    </Layout.Sider>
  );
});
