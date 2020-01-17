import React from 'react';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/es/modal';
import { ExclamationCircleOutlined } from '@ant-design/icons';

/**
 * 确认对话框
 */
export const modalConfirm = (funcProps: ModalFuncProps) => {
  Modal.confirm({
    icon: <ExclamationCircleOutlined />,
    ...funcProps,
  });
};

/**
 * 删除对话框
 */
export const modalConfirmDel = ({ okButtonProps, ...funcProps }: ModalFuncProps) => {
  modalConfirm({
    title: '确定要删除吗？',
    content: '删除后数据将无法恢复',
    okButtonProps: { danger: true, ...okButtonProps },
    ...funcProps,
  });
};
