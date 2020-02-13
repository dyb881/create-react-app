import React, { useRef } from 'react';
import { ConfigProvider, BackTop, Spin, Button, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { FormProps } from 'antd/es/form';
import { ButtonProps } from 'antd/es/button';
import { ConfigProviderProps } from 'antd/es/config-provider';
import ImgSource, { IImgProps } from '@dyb881/img';
import '@dyb881/img/lib/style.css';
import { combine, Form, FormItem, TFormItemProps } from 'common';
import { RouterBreadcrumb } from './router_component';
import classNames from 'classnames';
import style from './style.module.less';

export type TPageBoxProps = React.HTMLAttributes<HTMLDivElement> & {
  loading?: boolean | string;
  configProviderProps?: ConfigProviderProps;
};

/**
 * 页面盒子
 */
export const PageBox: React.FC<TPageBoxProps> = ({ loading, children, className, configProviderProps, ...props }) => {
  const box = useRef(null);

  return (
    <ConfigProvider getPopupContainer={() => box.current || document.body} {...configProviderProps}>
      <div className={classNames(`fill overflow ${style.page}`, className)} ref={box} {...props}>
        {box.current && <BackTop target={() => box.current!} style={{ right: 50 }} />}
        <Spin spinning={!!loading} tip={typeof loading === 'string' ? loading : undefined}>
          {children}
        </Spin>
      </div>
    </ConfigProvider>
  );
};

/**
 * 基础页面布局
 */
export const Page = combine<TPageBoxProps>(({ stores, configProviderProps, className, children, ...props }) => {
  const { componentSize } = stores.view.pageConfig;

  return (
    <PageBox
      configProviderProps={{ componentSize, ...configProviderProps }}
      className={classNames(style[componentSize], className)}
      {...props}
    >
      <RouterBreadcrumb />
      {children}
    </PageBox>
  );
});

/**
 * 自适应表单
 */
export const FormMobile = combine<FormProps>(({ stores, layout, ...props }) => (
  <Form layout={stores.view.isMobile ? 'vertical' : layout} {...props} />
));

/**
 * 自适应表单 Item
 */
export const FormItemMobile = combine<TFormItemProps>(({ stores, labelCol, wrapperCol, ...props }) => {
  if (!stores.view.isMobile) Object.assign(props, { labelCol, wrapperCol });
  return <FormItem {...props} />;
});

/**
 * 自适应按钮
 */
export const ButtonMobile = combine<ButtonProps>(({ stores, icon, children, ...props }) => {
  const { isMobile, pageConfig } = stores.view;

  return (isMobile || pageConfig.componentSize === 'small') && icon ? (
    <Tooltip placement="top" title={children}>
      <Button shape="circle" icon={icon} {...props} />
    </Tooltip>
  ) : (
    <Button icon={icon} {...props}>
      {children}
    </Button>
  );
});

/**
 * 图片组件
 */
export const Img: React.FC<IImgProps> = props => (
  <ImgSource loadedTip={<Spin />} reloadTip={<ReloadOutlined className="pointer" />} {...props} />
);
