import React from 'react';
import style from './style.module.less';

/**
 * tabs 配置
 * 绑定组件路径。默认为 /src/pages 下的文件或文件夹：标题
 */
const tabsConfig: any = {
  home: '首页',
  user: '我的',
};

/**
 * tabs 导出
 * 返回 tabbar 配置
 */
const tabs = Object.keys(tabsConfig).map(i => ({
  Child: require('pages/' + i).default,
  render: (active: boolean) => <Tab active={active}>{tabsConfig[i]}</Tab>,
}));

interface ITabProps {
  icon?: React.ReactNode;
  active: boolean;
}

const Tab: React.SFC<ITabProps> = ({ icon, active, children }) => (
  <div className={`fill center transition ${style.tab} ${active ? style.active : ''}`}>
    <span>{children}</span>
    {icon}
  </div>
);

export default tabs;