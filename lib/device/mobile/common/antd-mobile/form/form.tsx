import React, { useCallback } from 'react';
import { Toast } from 'antd-mobile';
import RefForm, { useForm as useFormSource } from 'rc-field-form';
import { FormProps } from 'rc-field-form/es/Form';
import { ValidateErrorEntity } from 'rc-field-form/es/interface';

/**
 * 表单组件
 */
export const Form: React.FC<FormProps> = props => {
  const onFinishFailed = useCallback((errorInfo: ValidateErrorEntity) => {
    Toast.fail(errorInfo.errorFields[0].errors[0], 1);
  }, []);

  return <RefForm onFinishFailed={onFinishFailed} {...props} />;
};

/**
 * 表单 hooks
 */
export const useForm = () => {
  const [form] = useFormSource();
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
