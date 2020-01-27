import React from 'react';
import { Badge } from 'antd';
import { Link } from 'react-router-dom';
import { TableProps } from 'antd/es/table';
import { Action, TInfoModalEdit } from 'components';

/**
 * 生成表格配置数据
 */
export const createColumns = (edit: TInfoModalEdit) => {
  const columns: TableProps<any>['columns'] = [
    { title: '用户名', dataIndex: 'username', fixed: 'left', width: 120 },
    { title: '昵称', dataIndex: 'nickname', width: 160 },
    { title: '角色', dataIndex: 'role', render: v => options.role[v], width: 120 },
    { title: '注册IP', dataIndex: 'regip', width: 160 },
    { title: '登陆IP', dataIndex: 'loginip', width: 160 },
    { title: '注册时间', dataIndex: 'regtime', width: 180 },
    { title: '登陆时间', dataIndex: 'logintime', width: 180 },
    { title: '状态', dataIndex: 'state', width: 100, fixed: 'right', render: v => renders.state[v] },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: data => (
        <Action>
          <span className="edit pointer" onClick={() => edit(data)}>
            弹窗编辑
          </span>
          <Link to={`/admin/account/info/${data.id}`} className="edit">
            编辑
          </Link>
          <span className="delete pointer">删除</span>
        </Action>
      ),
    },
  ];

  return columns;
};

export const options = {
  role: ['超级管理员', '编辑员'],
  state: ['未审核', '已审核', '冻结'],
};

export const renders = {
  state: [
    <Badge status="default" text="未审核" />,
    <Badge status="success" text="已审核" />,
    <Badge status="processing" text="冻结" />,
  ],
};
