import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb as BreadcrumbOld } from 'antd';
import { BreadcrumbProps, BreadcrumbItemProps } from 'antd/es/breadcrumb';

interface IBreadcrumbItemProps extends BreadcrumbItemProps {
  text: string;
  href?: string;
}

interface IBreadcrumbProps extends BreadcrumbProps {
  data: IBreadcrumbItemProps[];
}

/**
 * 面包屑
 */
export const Breadcrumb: React.SFC<IBreadcrumbProps> = ({ data, ...props }) => (
  <BreadcrumbOld style={{ marginBottom: 16 }} {...props}>
    {data.map(({ text, href, ...i }, k) => (
      <BreadcrumbOld.Item key={k} {...i}>
        {href ? <Link to={href}>{text}</Link> : text}
      </BreadcrumbOld.Item>
    ))}
  </BreadcrumbOld>
);

export default Breadcrumb;
