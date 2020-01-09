import React from 'react';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/es/modal';
import { ExclamationCircleOutlined } from '@ant-design/icons';

/**
 * 确认对话框
 */
export const ModalConfirm: React.FC<ModalFuncProps> = ({ children, ...props }) => {
  if (!React.isValidElement(children)) return <>{children}</>;

  return React.cloneElement(children, {
    onClick: () =>
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        ...props,
      }),
  });
};

/**
 * 删除对话框
 */
export const ModalConfirmDel: React.FC<ModalFuncProps> = ({ children, ...props }) => (
  <ModalConfirm okButtonProps={{ danger: true }} title="确定要删除吗？" content="删除后数据将无法恢复" {...props}>
    <span className="delete">{children || '删除'}</span>
  </ModalConfirm>
);
