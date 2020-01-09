import { useCallback } from 'react';
import { Form as FormSource } from 'antd';

/**
 * 表单组件
 */
export const Form = FormSource;

/**
 * 表单 hooks
 */
export const useForm = () => {
  const [form] = FormSource.useForm();
  const { submit } = form;

  /**
   * 重置清空表单
   */
  const reset = useCallback(() => {
    form.resetFields();
  }, []);

  /**
   * 重置清空表单，并提交表单
   */
  const resetSubmit = useCallback(() => {
    reset();
    submit();
  }, []);

  return { form, submit, reset, resetSubmit };
};
