import React from 'react';
import { Link } from 'react-router-dom';
import { ColumnProps } from 'antd/es/table';
import { Action, toScrollX } from 'components';
import Modal from './modal';

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
      render: v => options.role[v],
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
      width: 75,
      fixed: 'right',
      render: v => options.state[v],
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (data: any) => (
        <Action>
          <Modal data={data}>
            <span className="edit pointer">弹窗编辑</span>
          </Modal>
          <Link to={`/admin/account/info/${data.id}`} className="edit">
            编辑
          </Link>
        </Action>
      ),
    },
  ];
  return {
    columns,
    scroll: { x: toScrollX(columns, 200) },
  };
};

export const options = {
  role: ['超级管理员', '编辑员'],
  state: ['未审核', '已审核', '冻结'],
};
