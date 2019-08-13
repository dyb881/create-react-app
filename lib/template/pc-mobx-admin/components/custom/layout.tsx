/**
 * 通用布局
 */
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { withRouter, matchPath } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Spin } from 'antd';
import { Box, IBoxProps, Breadcrumb, IBreadcrumbProps, IMenuProps, PageHeader, Table } from '../antd';
import { BreadcrumbProps } from 'antd/es/breadcrumb';
import { PageHeaderProps } from 'antd/es/page-header';
import { TableProps } from 'antd/es/table';
import { IStore, IRoute } from 'types';
import classNames from 'classnames';
import menuData from 'config/menuData';
import { debounce } from 'lodash';
import style from './style.module.less';

/**
 * 顶部右边信息
 */
export const Header = () => (
  <>
    <span>你好管理员！</span>
    <span className="error">注销</span>
  </>
);

/**
 * 全局加载状态监听
 * 自动填满当前元素
 */
export const Loading: React.SFC<IStore> = inject('store')(
  observer(({ store }) => {
    const { isLoading } = store!.view;
    return isLoading ? (
      <Spin className={`fill center ${style.loading}`} tip={typeof isLoading === 'string' ? isLoading : undefined} />
    ) : null;
  })
);

/**
 * 自定义页面盒子
 * 添加内边距，从上到下排列，并子元素固定间隔 16px
 */
export const PageBox: React.SFC<IBoxProps> = ({ className, ...props }) => (
  <Box className={classNames(style.pageBox, className)} {...props} />
);

/**
 * 路由面包屑
 */
const RouterBreadcrumbOld: React.SFC<IRoute & BreadcrumbProps> = ({ location, history, match, style, ...props }) => {
  /**
   * 计算得出面包屑配置
   */
  const data = useMemo(() => {
    const getItems = (data: IMenuProps['data']) => {
      let items: IBreadcrumbProps['data'] = [];
      data.forEach(({ to, title, child }) => {
        if (child) {
          const items_ = getItems(child);
          if (items_.length) items = [{ to, text: title }, ...items_];
        } else if (matchPath(location.pathname, { path: to, exact: true })) {
          items = [{ text: title }];
        }
      });
      return items;
    };

    return getItems(menuData);
  }, [location.pathname]);

  return <Breadcrumb data={data} style={{ marginBottom: 16, ...style }} {...props} />;
};

/**
 * 路由面包屑
 * 自动根据路由和导航配置 config/menuData.ts 生成对应配置写入
 */
export const RouterBreadcrumb = withRouter(RouterBreadcrumbOld);

export interface IRouterPageHeaderProps extends IRoute {
  subTitle?: PageHeaderProps['subTitle'];
  backIcon?: PageHeaderProps['backIcon'];
  tags?: PageHeaderProps['tags'];
  extra?: PageHeaderProps['extra'];
  breadcrumb?: PageHeaderProps['breadcrumb'];
  footer?: PageHeaderProps['footer'];
  onBack?: PageHeaderProps['onBack'];
}

/**
 * 路由页头
 */
const RouterPageHeaderOld: React.SFC<IRouterPageHeaderProps> = ({ location, history, match, ...props }) => {
  /**
   * 计算得出页面标题
   */
  const title = useMemo(() => {
    const getItems = (data: IMenuProps['data']) => {
      let items = '';
      data.forEach(({ to, title, child }) => {
        if (matchPath(location.pathname, { path: to, exact: true })) {
          items = title;
        } else if (!items && child) {
          items = getItems(child);
        }
      });
      return items;
    };

    return getItems(menuData);
  }, [location.pathname]);

  return <PageHeader title={title} {...props} />;
};

/**
 * 路由页头
 * 自动根据路由和导航配置 config/menuData.ts 生成对应标题
 */
export const RouterPageHeader = withRouter(RouterPageHeaderOld);

/**
 * 自动计算高度的表格
 */
export const AutoTable: React.SFC<TableProps<any>> = ({ scroll, ...props }) => {
  const box = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const resize = debounce(() => setKey(+new Date()), 1000);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const { height, y } = useMemo(() => {
    if (box.current) {
      const thead = box.current.getElementsByTagName('thead')[0];
      const pagination = box.current.nextElementSibling;

      const top = box.current.offsetTop + 64;
      const bottom = (pagination ? pagination.clientHeight : 0) + 16 + 16; // 分页栏高度 + 边距 + 边距
      const height = window.innerHeight - top - bottom;

      return {
        height,
        y: height - thead.clientHeight,
      };
    }
    return {
      height: undefined,
      y: true,
    };
  }, [box.current && box.current.offsetTop, key]);

  return (
    <div ref={box} style={{ height, marginBottom: 16, marginTop: 16 }}>
      <Table pagination={false} scroll={{ y, x: true, ...scroll }} {...props} />
    </div>
  );
};

/**
 * 创建页面元素
 * 自定义页面盒子 PageBox + 自动路由面包屑 RouterBreadcrumb
 */
export const Page: React.SFC<IBoxProps> = ({ children, ...props }) => (
  <PageBox {...props}>
    <RouterBreadcrumb />
    {children}
  </PageBox>
);
