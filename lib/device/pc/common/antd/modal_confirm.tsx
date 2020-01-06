import React from 'react';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/es/modal';

type TProps = ModalFuncProps & {
  children: JSX.Element;
};

/**
 * 对话确认框
 */
export const ModalConfirm: React.SFC<TProps> = ({ children, ...props }) =>
  React.cloneElement(children, {
    onClick: () => Modal.confirm(props),
  });

/**
 * 删除对话框
 */
export const ModalConfirmDel: React.SFC<ModalFuncProps> = ({ children, ...props }) => (
  <ModalConfirm okType="danger" title="确定要删除吗？" content="删除后数据将无法恢复" {...props}>
    <span className="delete">{children}</span>
  </ModalConfirm>
);

export default ModalConfirm;
