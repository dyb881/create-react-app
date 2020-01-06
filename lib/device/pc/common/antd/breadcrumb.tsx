import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb as BreadcrumbOld } from 'antd';
import { BreadcrumbProps, BreadcrumbItemProps } from 'antd/es/breadcrumb';

type TBreadcrumbItemProps = BreadcrumbItemProps & {
  to?: string; // 跳转地址
  text: string; // 显示文本
};

export type TBreadcrumbProps = BreadcrumbProps & {
  data: TBreadcrumbItemProps[];
};

/**
 * 面包屑
 * 可由配置生成可跳转的面包屑
 */
export const Breadcrumb: React.SFC<TBreadcrumbProps> = ({ data, ...props }) => (
  <BreadcrumbOld {...props}>
    {data.map(({ to, text, ...i }, k) => (
      <BreadcrumbOld.Item key={k} {...i}>
        {to ? <Link to={to}>{text}</Link> : text}
      </BreadcrumbOld.Item>
    ))}
  </BreadcrumbOld>
);

export default Breadcrumb;
