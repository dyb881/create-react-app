import React, { useState, useCallback, useMemo, forwardRef } from 'react';
import { ConfigProvider, Layout, Drawer, Switch, Avatar, Modal, Tooltip } from 'antd';
import { combine, Form, FormItem, RadioButton, InputNumber, Dropdown, TMenuData, THTMLAttr } from 'common';
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
  const { view, user } = stores;
  const { isMobile, pageConfig, setPageConfig } = view;
  const { info, logoutConfirm } = user;
  const { hiddenMenu, hiddenHeader, headerIconRight } = pageConfig;

  // 用户下拉菜单
  const data = useMemo(() => {
    return [{ title: '个人中心' }, { title: <span className="error">退出</span>, onClick: logoutConfirm }];
  }, []);
  const onClickItem = useCallback((data: TMenuData) => data.onClick?.(), []);
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
      className={classNames(`transition ${style.header}`, {
        [style.hidden]: hiddenHeader && !showHeader,
      })}
    >
      <div className="between-center">
        <Interval className="center" left>
          {(isMobile || hiddenMenu) && <img src={require('images/logo.ico')} alt="" className={style.logo} />}
          {hiddenHeader || <MenuSwitch />}
        </Interval>
        <Interval className="center">
          <Avatar icon={<UserOutlined />} size="small" />
          <Dropdown data={data} onClickItem={onClickItem}>
            <div className={`pointer ${style.userName}`}>{info.nickname || '未登录'}</div>
          </Dropdown>
          <Tooltip placement="bottom" title="全屏">
            <Fullscreen />
          </Tooltip>
          <Tooltip placement="left" title="网页设置">
            <SettingOutlined onClick={onShow} />
          </Tooltip>
        </Interval>
        <Drawer title="网页设置" onClose={onClose} visible={visible}>
          <ConfigProvider componentSize="small">
            <Form initialValues={pageConfig} onValuesChange={onValuesChange}>
              <FormItem label="组件尺寸" name="componentSize">
                <RadioButton buttonStyle="solid" options={componentSizeOptions} />
              </FormItem>
              <FormItem label="菜单主题色" name="theme">
                <RadioButton buttonStyle="solid" options={themeOptions} />
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
      </div>
    </Layout.Header>
  );
});

const componentSizeOptions = [
  { label: '默认' },
  { label: '大', value: 'large' },
  { label: '中', value: 'middle' },
  { label: '小', value: 'small' },
];

const themeOptions = { dark: '暗色', light: '亮色' };

/**
 * 间隔，默认右对齐
 */
export const Interval: React.FC<THTMLAttr<HTMLDivElement> & { left?: boolean }> = ({ left, className, ...props }) => (
  <span className={classNames(style.interval, style[left ? 'left' : 'right'], className)} {...props} />
);

type TMenuSwitchProps = {
  style?: React.CSSProperties;
  className?: string;
};

/**
 * 菜单开关按钮
 */
export const MenuSwitch = combine<TMenuSwitchProps>(({ stores, ...props }) => {
  const { isMobile, collapsed, siderOnChange, pageConfig } = stores.view;
  const { hiddenMenu } = pageConfig;

  return React.cloneElement((isMobile || hiddenMenu) !== collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />, {
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
export const Fullscreen = forwardRef<HTMLSpanElement, TFullscreenProps>(
  ({ getElement = () => document.documentElement, className, ...props }, ref) => {
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
      ...props,
      onClick,
      className: classNames('pointer', className),
      ref,
    });
  }
);
