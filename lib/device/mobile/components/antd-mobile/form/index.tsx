import React, { useMemo, useImperativeHandle, forwardRef, useEffect } from 'react';
import { createFormItem, TFormItemProps, TInitialValues } from './create_form_item';
import { Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { pickBy } from 'lodash';

/**
 * 表单 ref
 */
export type TFormRef = {
  submit(): void;
  reset(): void;
  resetSubmit(): void;
  form: any;
};

/**
 * 表单值创建组件
 */
export type TFormChildren = (FormItem: React.SFC<TFormItemProps>, formRef: TFormRef) => JSX.Element;

/**
 * 表单 props
 */
export type TFormProps = React.HTMLProps<HTMLFormElement> & {
  children: TFormChildren; // 表单值创建组件
  onSub?: (values: any) => void; // 提交表单回调
  onErr?: (err: any) => void; // 表单错误回调
  defaultFieldsValue?: object; // 表单默认值
  initialValues?: TInitialValues; // 表单初始值
  deleteNullValue?: boolean; // 删除空值
  form?: any; // 表单对象
  ref?: any;
};

let FormComponent: React.SFC<TFormProps> = (
  { children, onSub, onErr, defaultFieldsValue, initialValues, deleteNullValue, form, ...props },
  ref
) => {
  useEffect(() => {
    // 第一次获取默认值的时候写入默认值
    defaultFieldsValue && form.setFieldsValue(defaultFieldsValue);
  }, [!defaultFieldsValue]);

  /**
   * 表单 FormItem
   * 用于快速绑定字段生成表单
   */
  const FormItem = useMemo(() => createFormItem(form.getFieldDecorator, initialValues), [
    JSON.stringify(initialValues),
  ]);

  const { submit, reset, resetSubmit, onSubmit } = useMemo(() => {
    /**
     * 提交表单方法
     */
    const submit = () => {
      form.validateFields((err: any, values: any) => {
        if (err) {
          // 提交表单失败
          if (onErr) {
            onErr(err);
          } else {
            Toast.fail(err[Object.keys(err)[0]].errors[0].message, 1);
          }
        } else {
          // 删除空值
          if (deleteNullValue) {
            values = pickBy(values, v => v !== undefined && v !== null && v !== '');
          }
          // 成功提交表单
          onSub && onSub(values);
        }
      });
    };

    /**
     * 重置清空表单
     */
    const reset = () => {
      form.resetFields();
    };

    /**
     * 重置清空表单，并提交表单
     */
    const resetSubmit = () => {
      reset();
      submit();
    };

    /**
     * 表单提交执行
     */
    const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      submit();
    };

    return { submit, reset, resetSubmit, onSubmit };
  }, []);

  /**
   * 表单相关方法和对象
   */
  const formRef: TFormRef = { submit, reset, resetSubmit, form };

  // 暴露提交表单方法
  useImperativeHandle(ref, () => formRef, []);

  return (
    <form {...props} onSubmit={onSubmit}>
      {children && children(FormItem, formRef)}
    </form>
  );
};

FormComponent = forwardRef(FormComponent);

/**
 * 表单
 */
export const Form = createForm()(FormComponent) as React.ComponentClass<TFormProps>;

export default Form;
