import React, { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { PageHeader } from 'antd';
import { PageHeaderProps } from 'antd/es/page-header';
import { Breadcrumb, TBreadcrumbProps } from 'common';
import { getMenuNavDataTitle, getMenuNavDatas } from '../layout';
import { menuNavData } from 'configs';

type TRouterTitleProps = React.HTMLAttributes<HTMLSpanElement> & { before?: string; after?: string };

/**
 * 路由标题
 */
export const RouterTitle: React.FC<TRouterTitleProps> = ({ before, after, ...props }) => {
  const { pathname } = useLocation();

  const title = useMemo(() => getMenuNavDataTitle(menuNavData, pathname), [pathname]);

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
    const datas = getMenuNavDatas(menuNavData, pathname).map(i => ({ to: i.to, children: i.title }));
    datas[datas.length - 1].to = undefined; // 最后一个不需要跳转
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
export const RouterPageHeader: React.FC<TRouterPageHeaderProps> = ({ onBack, ...props }) => {
  const { goBack } = useHistory();

  return <PageHeader title={<RouterTitle />} onBack={onBack === true ? goBack : onBack} {...props} />;
};
