import React, { useState, useCallback } from 'react';
import { ConfigProvider, Layout, Drawer, Switch, Avatar, Modal } from 'antd';
import { combine, Form, FormItem, RadioButton, InputNumber } from 'common';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  MobileOutlined,
  UserOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import screenfull, { Screenfull } from 'screenfull';
import classNames from 'classnames';
import style from './style.module.less';

export const Header = combine(({ stores }) => {
  const [showHeader, setShowHeader] = useState(false);
  const [visible, setVisible] = useState(false);
  const { isMobile, pageConfig, setPageConfig } = stores.view;
  const { hiddenHeader, headerIconRight } = pageConfig;

  const onShow = useCallback(() => setVisible(true), []);
  const onClose = useCallback(() => setVisible(false), []);
  const onShowHeader = useCallback(() => setShowHeader(showHeader => !showHeader), []);
  const onValuesChange = useCallback((changeValue: any, values: any) => {
    if (Object.keys(changeValue)[0] === 'hiddenHeader' && changeValue.hiddenHeader) {
      setShowHeader(false);
    }
    setPageConfig(values);
  }, []);

  return (
    <Layout.Header
      className={classNames(`between-center transition ${style.header}`, {
        [style.hidden]: hiddenHeader && !showHeader,
      })}
    >
      <div className={style.left}>
        {isMobile && <img src={require('images/logo.ico')} alt="" className={style.logo} />}
        {hiddenHeader || <MenuSwitch />}
      </div>
      <div className={style.right}>
        <Avatar icon={<UserOutlined />} size="small" />
        <div className={style.userName}>User Name</div>
        <Fullscreen className={style.fullscreen} />
        <SettingOutlined onClick={onShow} />
      </div>
      <Drawer title="网页设置" onClose={onClose} visible={visible}>
        <ConfigProvider componentSize="small">
          <Form initialValues={pageConfig} onValuesChange={onValuesChange}>
            <FormItem label="主题色" name="theme">
              <RadioButton buttonStyle="solid" options={{ dark: '暗色', light: '亮色' }} />
            </FormItem>
            <FormItem label="隐藏菜单" name="hiddenMenu" valuePropName="checked">
              <Switch />
            </FormItem>
            <FormItem label="隐藏页头" name="hiddenHeader" valuePropName="checked">
              <Switch />
            </FormItem>
            <FormItem label="菜单开关 Top" name="menuIconTop" placeholder>
              <InputNumber min={0} />
            </FormItem>
            <FormItem label="页头开关 Right" name="headerIconRight" placeholder>
              <InputNumber min={0} />
            </FormItem>
          </Form>
        </ConfigProvider>
      </Drawer>
      {hiddenHeader && (
        <div className={`transition ${style.showHeader}`} onClick={onShowHeader} style={{ right: headerIconRight }}>
          <MobileOutlined className={style.icon} />
        </div>
      )}
    </Layout.Header>
  );
});

type TMenuSwitchProps = {
  style?: React.CSSProperties;
  className?: string;
};

/**
 * 菜单开关按钮
 */
export const MenuSwitch = combine<TMenuSwitchProps>(({ stores, ...props }) => {
  const { isMobile, collapsed, siderOnChange } = stores.view;

  return React.cloneElement(isMobile !== collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />, {
    onClick: siderOnChange,
    ...props,
  });
});

type TFullscreenProps = TMenuSwitchProps & {
  getElement?: () => Element;
};

/**
 * 全屏
 */
export const Fullscreen: React.FC<TFullscreenProps> = ({ getElement = () => document.documentElement, ...props }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const s = screenfull as Screenfull;

  const onClick = useCallback(() => {
    if (!s.isEnabled) {
      Modal.error({ title: '不支持全屏', content: '该浏览器不支持全屏 API' });
      return;
    }

    if (s.isFullscreen) {
      s.exit();
    } else {
      s.request(getElement());
    }
    setIsFullscreen(!s.isFullscreen);
  }, []);

  return React.cloneElement(isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />, {
    onClick,
    ...props,
  });
};
