import React from 'react';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/es/modal';

interface IModalConfirmProps extends ModalFuncProps {
  children: JSX.Element;
}

/**
 * 对话确认框
 */
export class ModalConfirm extends React.Component<IModalConfirmProps> {
  onClick = () => {
    const { children, ...props } = this.props;
    Modal.confirm(props);
  };

  render() {
    return React.cloneElement(this.props.children, { onClick: this.onClick });
  }
}

/**
 * 删除对话框
 */
export const ModalConfirmDel: React.SFC<ModalFuncProps> = ({ children, ...props }) => (
  <ModalConfirm okType="danger" title="确定要删除吗？" content="删除后数据将无法恢复" {...props}>
    <span className="delete">{children}</span>
  </ModalConfirm>
);

export default ModalConfirm;
