/**
 * 通用布局
 */
import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { useHistory, useLocation, matchPath } from 'react-router-dom';
import { Icon } from 'antd-mobile';
import { TStore } from 'types';
import { routersConfig } from 'config';
import style from './style.module.less';

/**
 * 全局标题
 */
export const Title: React.SFC<TStore> = inject('store')(observer(({ store }) => <div>{store!.view.title}</div>));

/**
 * 标题监听
 */
export const TitleMonitor: React.SFC<TStore> = inject('store')(
  observer(({ store }) => {
    const { pathname } = useLocation();

    useEffect(() => {
      for (let { title, to } of routersConfig) {
        if (matchPath(pathname, { path: to, exact: true })) {
          store!.view.setTitle(title);
          console.log(title)
          return;
        }
      }
    }, [pathname]);

    return null;
  })
);

/**
 * 头部
 */
export const Header: React.SFC = () => {
  const { goBack } = useHistory();
  return (
    <div className={`center ${style.header}`}>
      <div className={`center ${style.left}`} onClick={goBack}>
        <Icon type="left" />
      </div>
      <Title />
    </div>
  );
};

/**
 * 子页面布局
 */
export const PageBox: React.SFC = ({ children }) => (
  <div className="page">
    <Header />
    <div className={`box-fill ${style.page}`}>{children}</div>
  </div>
);
