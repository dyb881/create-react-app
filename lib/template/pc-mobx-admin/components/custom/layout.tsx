/**
 * 通用布局
 */
import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import { matchPath, useLocation } from 'react-router-dom';
import { Box, TBoxProps, Breadcrumb, TBreadcrumbProps, TMenuProps, PageHeader, Table, ModalConfirmDel } from '../antd';
import { BreadcrumbProps } from 'antd/es/breadcrumb';
import { PageHeaderProps } from 'antd/es/page-header';
import { TableProps } from 'antd/es/table';
import { TStore, TNotRequired } from 'types';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { menuData } from 'config';
import style from './style.module.less';

/**
 * 顶部右边信息
 */
export const Header: React.SFC<TStore> = inject('store')(
  observer(({ store }) => {
    const logout = useCallback(() => {
      store!.user.onLogin(false);
    }, []);

    return (
      <>
        <span>你好管理员！</span>
        <ModalConfirmDel title="注销登录" content="点击确认注销登录" onOk={logout}>
          <span className="error pointer">注销</span>
        </ModalConfirmDel>
      </>
    );
  })
);

/**
 * 自定义页面盒子
 * 添加内边距，从上到下排列，并子元素固定间隔 16px
 */
export const PageBox: React.SFC<TBoxProps> = ({ className, ...props }) => (
  <Box className={classNames(style.pageBox, className)} {...props} />
);

/**
 * 路由面包屑
 * 自动根据路由和导航配置 config/menuData.ts 生成对应配置写入
 */
export const RouterBreadcrumb: React.SFC<BreadcrumbProps> = ({ style, ...props }) => {
  const { pathname } = useLocation();

  /**
   * 计算得出面包屑配置
   */
  const data = useMemo(() => {
    const getItems = (data: TMenuProps['data']) => {
      let items: TBreadcrumbProps['data'] = [];
      data.forEach(({ to, title, child }) => {
        if (matchPath(pathname, { path: to, exact: true })) {
          items = [{ text: title }];
        } else if (child) {
          const items_ = getItems(child);
          if (items_.length) items = [{ to, text: title }, ...items_];
        }
      });
      return items;
    };

    return getItems(menuData);
  }, [pathname]);

  return <Breadcrumb data={data} style={{ marginBottom: 16, ...style }} {...props} />;
};

type TRouterTitleProps = React.HTMLProps<HTMLSpanElement> & {
  before?: string; // 之前
  after?: string; // 之后
};

/**
 * 路由标题
 * 自动根据路由和导航配置 config/menuData.ts 生成对应标题
 */
export const RouterTitle: React.SFC<TRouterTitleProps> = ({ before, after, ...props }) => {
  const { pathname } = useLocation();

  /**
   * 计算得出页面标题
   */
  const title = useMemo(() => {
    const getItems = (data: TMenuProps['data']) => {
      let items = '';
      data.forEach(({ to, title, child }) => {
        if (matchPath(pathname, { path: to, exact: true })) {
          items = title;
        } else if (!items && child) {
          items = getItems(child);
        }
      });
      return items;
    };

    return getItems(menuData);
  }, [pathname]);

  return (
    <span {...props}>
      {before}
      {title}
      {after}
    </span>
  );
};

/**
 * 路由页头
 * 自动根据路由和导航配置 config/menuData.ts 生成对应标题
 */
export const RouterPageHeader: React.SFC<TNotRequired<PageHeaderProps>> = props => (
  <PageHeader title={<RouterTitle />} {...props} />
);

/**
 * 自动获取 key 的更新时机
 */
const useAutoResize = () => {
  const box = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const resize = debounce(() => setKey(+new Date()), 1000);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return { box, key };
};

/**
 * 自动计算高度的盒子
 */
export let AutoBox: React.SFC<React.HTMLProps<HTMLDivElement>> = ({ className, style: styles, ...props }) => {
  const { box, key } = useAutoResize();

  const maxHeight = useMemo(() => {
    if (box.current) {
      const top = box.current.offsetTop + 64;
      const bottom = 16; // 边距
      const maxHeight = window.innerHeight - top - bottom;

      return maxHeight;
    }
    return undefined;
  }, [box.current && box.current.offsetTop, key]);

  return <div ref={box} className={classNames(style.autoBox, className)} style={{ maxHeight, ...styles }} {...props} />;
};

/**
 * 自动计算高度的表格
 */
export const AutoTable: React.SFC<TableProps<any>> = ({ scroll, ...props }) => {
  const { box, key } = useAutoResize();

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
export const Page: React.SFC<TBoxProps> = ({ children, ...props }) => (
  <PageBox {...props}>
    <RouterBreadcrumb />
    {children}
  </PageBox>
);
