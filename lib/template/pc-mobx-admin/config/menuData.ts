import { TRouters } from './routers';
import { IMenuProps } from 'components';

/**
 * 左侧导航数据和标题数据
 * 除了菜单导航数据外，path 是相对 /src/pages 引用文件的路径
 */
export const menuData: IMenuProps['data'] = [
  {
    title: '管理员',
    icon: 'user',
    child: [
      {
        to: '/admin/account',
        title: '管理员账号',
        child: [
          {
            to: '/admin/account/info',
            title: '添加管理员账号',
            hidden: true,
          },
          {
            to: '/admin/account/info/:id',
            title: '编辑管理员账号',
            hidden: true,
          },
        ],
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

/**
 * 获取导航数据中路由信息
 */
export const getMenuRouters = (menu = menuData) => {
  let routers: TRouters = {};
  menu.forEach(i => {
    if (i.to) routers[i.to] = i.path || i.to.slice(1).split('/:')[0];
    if (i.child) routers = { ...routers, ...getMenuRouters(i.child) };
  });
  return routers;
};

export default menuData;
