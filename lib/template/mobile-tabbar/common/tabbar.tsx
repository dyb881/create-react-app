import React, { useEffect, useCallback } from 'react';
import TabBar, { TTab } from '@dyb881/tab-bar';
import '@dyb881/tab-bar/lib/style.css';
import { combine } from './stores';

/**
 * tab 配置
 */
type TTabBar = {
  icon?: React.ReactNode;
  text: React.ReactNode; // 显示标题
  path?: string; // 绑定组件路径，默认为 /src/pages 下的文件或文件夹
  component?: React.ComponentType<any>; // 绑定组件，优先度低于 path
  [key: string]: any;
};

/**
 * tabbar 配置数组
 */
export type TTabBars = TTabBar[];

/**
 * tabbar 选项
 */
export type TTabbarOptions = {
  transition?: boolean; // 是否开启切换动画
  tabStyle: React.CSSProperties; // 样式
  activeStyle: React.CSSProperties; // 选中样式，会与 tabStyle 叠加
  listen?: (tabbar: TTabBar) => void; // tabbar 监听
};

export const createTabBarPage = (tabBars: TTabBars, { transition, tabStyle, activeStyle, listen }: TTabbarOptions) => {
  type TTabProps = {
    icon?: React.ReactNode;
    active: boolean;
  };

  /**
   * tab 组件
   */
  const Tab: React.SFC<TTabProps> = ({ icon, active, children }) => (
    <div className="fill column-center" style={active ? { ...tabStyle, ...activeStyle } : tabStyle}>
      <span>{children}</span>
      {icon}
    </div>
  );

  /**
   * 配置数组
   */
  const tabs: TTab[] = [];

  // 引用页面并写入配置
  tabBars.forEach(({ icon, text, path, component }) => {
    let Child;
    if (path) Child = require('pages/' + path).default;
    else if (component) Child = component;
    else return;
    const render = (active: boolean) => (
      <Tab active={active} icon={icon}>
        {text}
      </Tab>
    );
    tabs.push({ Child, render });
  });

  /**
   * TabBar 页面组件
   */
  const TabBarPage = combine(({ stores }) => {
    const { tabBarKey, setTabBarKey, tabBarHidden } = stores.view;
    // key 变动时执行监听
    useEffect(() => {
      listen?.(tabBars[tabBarKey]);
    }, [tabBarKey]);

    // tab 变动
    const onChange = useCallback(activeKey => {
      setTabBarKey(activeKey);
    }, []);

    return <TabBar tabs={tabs} activeKey={tabBarKey} onChange={onChange} transition={transition} hide={tabBarHidden} />;
  });

  return TabBarPage;
};
