import { toScrollX } from 'components';
import { ColumnProps } from 'antd/es/table';

/**
 * 生成表格配置数据
 */
export const createTableProps = () => {
  const columns: ColumnProps<any>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: v => role[v],
      width: 120,
    },
    {
      title: '注册IP',
      dataIndex: 'regip',
      width: 140,
    },
    {
      title: '登陆IP',
      dataIndex: 'loginip',
      width: 140,
    },
    {
      title: '注册时间',
      dataIndex: 'regtime',
      width: 180,
    },
    {
      title: '登陆时间',
      dataIndex: 'logintime',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 90,
      fixed: 'right',
      render: v => state[v],
    },
    {
      title: '操作',
      key: 'action',
      width: 90,
      fixed: 'right',
      render: () => '编辑',
    },
  ];
  return {
    columns,
    scroll: { x: toScrollX(columns, 200) },
  };
};

export const role = ['超级管理员', '编辑员'];

export const state = ['未审核', '已审核', '冻结'];
