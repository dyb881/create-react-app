import React, { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { PageHeader } from 'antd';
import { PageHeaderProps } from 'antd/es/page-header';
import { Breadcrumb, TBreadcrumbProps, THTMLAttr, getMenuNavDataTitle, getMenuNavDatas, menuData } from 'common';
import classNames from 'classnames';
import style from './style.module.less';

type TRouterTitleProps = THTMLAttr<HTMLSpanElement> & { before?: string; after?: string };

/**
 * 路由标题
 */
export const RouterTitle: React.FC<TRouterTitleProps> = ({ before, after, ...props }) => {
  const { pathname } = useLocation();

  const title = useMemo(() => getMenuNavDataTitle(menuData, pathname), [pathname]);

  return (
    <span {...props}>
      {before}
      {title}
      {after}
    </span>
  );
};

/**
 * 路由面包屑
 */
export const RouterBreadcrumb: React.FC<Partial<TBreadcrumbProps>> = ({ ...props }) => {
  const { pathname } = useLocation();

  const data = useMemo(() => {
    const datas = getMenuNavDatas(menuData, pathname).map(i => ({ to: i.to, children: i.title }));
    const endKey = datas.length - 1;
    if (datas[endKey]) datas[endKey].to = undefined; // 最后一个不需要跳转
    return datas;
  }, [pathname]);

  return <Breadcrumb data={data} {...props} />;
};

export type TRouterPageHeaderProps = Partial<Omit<PageHeaderProps, 'onBack'>> & {
  onBack?: true | PageHeaderProps['onBack'];
};

/**
 * 标题栏
 */
export const RouterPageHeader: React.FC<TRouterPageHeaderProps> = ({ onBack, className, ...props }) => {
  const { goBack } = useHistory();
  return (
    <PageHeader
      title={<RouterTitle />}
      onBack={onBack === true ? goBack : onBack}
      className={classNames(style.pageHeader, className)}
      {...props}
    />
  );
};
