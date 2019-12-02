import React, { useRef, useMemo, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Form as FormOld, ConfigProvider } from 'antd';
import { FormProps, FormComponentProps } from 'antd/es/form';
import { RcBaseFormProps, WrappedFormUtils } from 'antd/es/form/Form';
import { createFormItem, TFormItemProps, TInitialValues } from './create_form_item';
import { TItemProps } from './item';
import classNames from 'classnames';
import { pickBy } from 'lodash';

/**
 * 表单 ref
 */
export type TFormRef = {
  submit(): void; // 提交
  reset(): void; // 重置
  resetSubmit(): void; // 重置并提交
  form: WrappedFormUtils; // 表单对象
};

/**
 * 表单值创建组件
 */
export type TFormChildren = (FormItem: React.SFC<TFormItemProps>, formRef: TFormRef) => JSX.Element;

/**
 * 表单 props
 */
export type TFormProps = FormProps &
  RcBaseFormProps & {
    children: TFormChildren;
    onSub?: (values: any) => void; // 提交表单回调
    onErr?: (err: any) => void; // 表单错误回调
    defaultItemProps?: TItemProps; // FormItem 默认配置
    initialValues?: TInitialValues; // 表单初始值
    defaultFieldsValue?: object; // 表单默认值
    deleteNullValue?: boolean; // 删除空值
    boxProps?: React.HTMLProps<HTMLDivElement>; // box 类名
  };

let FormComponent: React.SFC<TFormProps & FormComponentProps> = (
  {
    children,
    onSub,
    onErr,
    defaultItemProps,
    initialValues,
    defaultFieldsValue,
    deleteNullValue,
    boxProps,
    form,
    className,
    ...props
  },
  ref
) => {
  const box = useRef(null);

  useEffect(() => {
    // 第一次获取默认值的时候写入默认值
    defaultFieldsValue && form.setFieldsValue(defaultFieldsValue);
  }, [!defaultFieldsValue]);

  /**
   * 表单 FormItem
   * 用于快速绑定字段生成表单
   */
  const FormItem = useMemo(() => createFormItem(form.getFieldDecorator, defaultItemProps, initialValues), [
    JSON.stringify(defaultItemProps),
    JSON.stringify(initialValues),
  ]);

  const { submit, reset, resetSubmit, onSubmit } = useMemo(() => {
    /**
     * 提交表单方法
     */
    const submit = () => {
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          // 提交表单失败
          onErr && onErr(err);
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
    <ConfigProvider getPopupContainer={() => box.current || document.body}>
      <div ref={box} {...boxProps}>
        <FormOld className={classNames('dyb-form', className)} onSubmit={onSubmit} {...props}>
          {children && children(FormItem, formRef)}
        </FormOld>
      </div>
    </ConfigProvider>
  );
};

FormComponent = forwardRef(FormComponent);

/**
 * 表单
 */
export const Form = (FormOld.create as any)()(FormComponent) as React.ComponentClass<TFormProps>;

export default Form;
