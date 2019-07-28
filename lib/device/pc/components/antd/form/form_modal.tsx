import React, { useRef, useReducer, useCallback } from 'react';
import { Modal } from 'antd';
import { ModalProps } from 'antd/es/modal';
import { Form, IFormProps } from './form';

export interface IFormModalProps extends ModalProps {
  onShow?: () => void; // 显示回调，常用于表单值初始化
  onHide?: () => void; // 隐藏回调
  children: [JSX.Element, IFormProps['children']]; // 弹出按钮，绑定点击事件，和表单 render
  onSub?: <T>(values: T) => Promise<boolean | undefined>; // 提交表单回调，返回 true 则隐藏弹窗
  formProps?: IFormProps;
}

/**
 * 表单弹窗
 */
export const FormModal: React.SFC<IFormModalProps> = ({
  onShow,
  onHide,
  children,
  onSub,
  formProps = {},
  ...props
}) => {
  const form = useRef<any>(null);
  const [state, dispatch] = useReducer((state, newState) => ({ ...state, ...newState }), {
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
  const onOk = useCallback(() => form.current.submit(), []);

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
      {React.cloneElement(children[0], { onClick: show })}
      <Modal onCancel={hide} maskClosable={false} destroyOnClose onOk={onOk} {...state} {...props}>
        <Form {...formProps} onSub={onSubmit} wrappedComponentRef={form}>
          {children[1]}
        </Form>
      </Modal>
    </>
  );
};

export default FormModal;
