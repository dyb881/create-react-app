import React from 'react';
import { UserOutlined, TeamOutlined, UnorderedListOutlined, FolderFilled, SettingOutlined } from '@ant-design/icons';
import { TMenuNavData } from 'components';

/**
 * 左侧导航数据和标题数据
 * 除了菜单导航数据外，path 是相对 /src/pages 引用文件的路径
 */
export const menuNavData: TMenuNavData[] = [
  {
    icon: <UserOutlined />,
    title: '管理员',
    children: [
      { to: '/admin/account', title: '管理员账号' },
      { to: '/admin/role', title: '管理员角色' },
    ],
  },
  {
    icon: <TeamOutlined />,
    title: '用户中心',
    children: [{ title: '用户账号' }, { title: '用户角色' }],
  },
  {
    icon: <UnorderedListOutlined />,
    title: '栏目管理',
    children: [{ title: '栏目分类' }, { title: '栏目列表' }],
  },
  {
    icon: <FolderFilled />,
    title: '文件管理',
    children: [{ title: '图片' }, { title: '视频' }, { title: '音频' }, { title: '其他' }],
  },
  {
    icon: <SettingOutlined />,
    title: '系统设置',
    children: [{ title: '站点配置' }, { title: '文件配置' }, { title: '自定义配置' }, { title: '系统日志' }],
  },
];
