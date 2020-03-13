import React from 'react';
import { UserOutlined, FolderFilled, UnorderedListOutlined } from '@ant-design/icons';
import { TMenuNavData } from 'components';

/**
 * 左侧导航数据和标题数据
 * 除了菜单导航数据外，path 是相对 /src/pages 引用文件的路径
 */
export const menuNavData: TMenuNavData[] = [
  {
    icon: <UserOutlined />,
    title: '账号管理',
    children: [
      {
        to: '/account',
        title: '所有账号',
      },
    ],
  },
  {
    icon: <FolderFilled />,
    title: '文件管理',
    children: [
      {
        to: '/uploadFile',
        title: '文件列表',
      },
    ],
  },
  {
    icon: <UnorderedListOutlined />,
    title: '栏目管理',
    children: [
      {
        to: '/menu',
        title: '菜单分类',
      },
      {
        to: '/info',
        title: '信息列表',
        children: [
          { to: '/info/info', title: '新建信息', hidden: true },
          { to: '/info/info/:id', title: '编辑信息', hidden: true },
        ],
      },
    ],
  },
];
