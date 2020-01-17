import React, { useState, useEffect, useCallback } from 'react';
import { ConfigProvider, Layout } from 'antd';
import { combine } from 'common';
import { Sider } from './sider';
import { Header } from './header';
import style from './style.module.less';

/**
 * 设置为中文简体
 */
import zh_CN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Content } = Layout;

export const LayoutBox = combine(({ children, stores }) => {
  const [key, setKey] = useState(0);
  const { theme } = stores.view.pageConfig;

  useEffect(() => {
    window.document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // 菜单导航重复点击当前
  const reload = useCallback(() => setKey(key => key + 1), []);

  return (
    <ConfigProvider locale={zh_CN}>
      <Layout className="fill">
        <Sider reload={reload} />
        <Layout>
          <Header />
          <Content key={key} className={style.content}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
});
