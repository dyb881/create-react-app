import React, { useRef, useReducer, useCallback } from 'react';
import { Modal } from 'antd';
import { ModalProps } from 'antd/es/modal';
import { Form, TFormProps, TFormRef } from './form';

export type TFormModalProps = ModalProps & {
  onShow?: () => void; // 显示回调，常用于表单值初始化
  onHide?: () => void; // 隐藏回调
  children: [React.ReactNode, TFormProps['children']]; // 弹出按钮，绑定点击事件，和表单 render
  onSub?: (values: any) => Promise<boolean | undefined>; // 提交表单回调，返回 true 则隐藏弹窗
  formProps?: Partial<TFormProps>;
};

/**
 * 表单弹窗
 */
export let FormModal: React.SFC<TFormModalProps> = ({ onShow, onHide, children, onSub, formProps = {}, ...props }) => {
  const formRef = useRef<TFormRef>(null);
  const [state, dispatch] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {
    visible: false,
    confirmLoading: false,
  });

  const show = useCallback(() => {
    dispatch({ visible: true });
    onShow && onShow();
  }, []);

  const hide = useCallback(() => {
    dispatch({ visible: false });
    onHide && onHide();
  }, []);

  // 点击确认按钮提交表单
  const onOk = useCallback(() => {
    formRef.current && formRef.current.submit();
  }, [!formRef.current]);

  // 提交表单执行并根据返回值决定是否隐藏弹窗
  const onSubmit = useCallback(async (values: any) => {
    const state: any = { confirmLoading: true };
    dispatch(state);
    if (onSub) state.visible = !(await onSub(values));
    state.confirmLoading = false;
    dispatch(state);
    formProps.onSub && formProps.onSub(values);
  }, []);

  return (
    <>
      {React.isValidElement(children[0]) ? React.cloneElement(children[0], { onClick: show }) : children[0]}
      <Modal onCancel={hide} maskClosable={false} destroyOnClose onOk={onOk} {...state} {...props}>
        <Form {...formProps} onSub={onSubmit} wrappedComponentRef={formRef}>
          {children[1]}
        </Form>
      </Modal>
    </>
  );
};

export default FormModal;
