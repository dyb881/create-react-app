import { IMenuProps } from 'components';

/**
 * 左侧导航数据和标题数据
 */
export const menuData: IMenuProps['data'] = [
  {
    title: '管理员',
    icon: 'user',
    child: [
      {
        to: '/admin/account',
        title: '管理员账号',
      },
      {
        to: '/admin/role',
        title: '管理员角色',
      },
    ],
  },
  {
    title: '用户中心',
    icon: 'team',
    child: [
      {
        title: '用户账号',
      },
      {
        title: '用户角色',
      },
    ],
  },
  {
    title: '栏目管理',
    icon: 'bars',
    child: [
      {
        title: '栏目分类',
      },
      {
        title: '栏目列表',
      },
    ],
  },
  {
    title: '文件管理',
    icon: 'folder',
    child: [
      {
        title: '图片',
      },
      {
        title: '视频',
      },
      {
        title: '音频',
      },
      {
        title: '其他',
      },
    ],
  },
  {
    title: '系统设置',
    icon: 'setting',
    child: [
      {
        title: '站点配置',
      },
      {
        title: '文件配置',
      },
      {
        title: '自定义配置',
      },
      {
        title: '系统日志',
      },
    ],
  },
];

export default menuData;
