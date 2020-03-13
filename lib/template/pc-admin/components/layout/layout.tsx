import React, { useState, useEffect, useCallback } from 'react';
import { ConfigProvider, Layout } from 'antd';
import { combine } from 'common';
import { Sider } from './sider';
import { Header } from './header';
import { debounce } from 'lodash';
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
  const { pageConfig, setTableData } = stores.view;
  const { theme } = pageConfig;

  // 菜单导航重复点击当前
  const reload = useCallback(() => setKey(key => key + 1), []);

  // 点击左侧导航菜单
  const onClickItem = useCallback(() => {
    setTableData('root'); // 清空表格页数据
  }, []);

  useEffect(() => {
    window.document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const resize = debounce(reload, 1000);
    window.addEventListener('resize', resize);
  }, []);

  return (
    <ConfigProvider locale={zh_CN}>
      <Layout className="fill">
        <Sider reload={reload} onClickItem={onClickItem} />
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
