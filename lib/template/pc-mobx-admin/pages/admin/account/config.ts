import { ColumnProps } from 'antd/es/table';

// 数据格式
export const createColumns = (_table: any) => {
  const res: ColumnProps<any>[] = [
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
      width: 160,
    },
    {
      title: '登陆时间',
      dataIndex: 'logintime',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 60,
      fixed: 'right',
      render: v => state[v],
    },
  ];
  return res;
};

export const state = ['未审核', '已审核', '冻结'];
