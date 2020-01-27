import React, { useCallback } from 'react';
import { Form as FormSource } from 'antd';
import { FormProps, FormInstance } from 'antd/es/form';

/**
 * 表单组件
 */
export const Form: React.FC<FormProps> = ({ layout, wrapperCol, labelCol, ...props }) => {
  const formProps: FormProps = { layout };
  if (layout === 'horizontal') Object.assign(formProps, { wrapperCol, labelCol });
  return <FormSource {...formProps} {...props} />;
};

export type TForm = {
  form: FormInstance;
  submit: FormInstance['submit'];
  reset(): void;
  resetSubmit(): void;
};

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
