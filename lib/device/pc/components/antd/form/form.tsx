import React, { useRef, useMemo, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Form as FormOld, ConfigProvider } from 'antd';
import { FormProps, FormComponentProps } from 'antd/es/form';
import { RcBaseFormProps, WrappedFormUtils } from 'antd/es/form/Form';
import { createFormItem, IFormItemProps, IInitialValues } from './create_form_item';
import { IItemProps } from './item';
import classNames from 'classnames';
import { pickBy } from 'lodash';

export interface IFormRef {
  submit: () => void;
  reset: () => void;
  resetSubmit: () => void;
  form: WrappedFormUtils;
}

export interface IFormProps extends FormProps, RcBaseFormProps {
  boxClassName?: string; // box 类名
  onSub?: (values: any) => void; // 提交表单回调
  onErr?: (err: any) => void; // 表单错误回调
  children?: (FormItem: React.SFC<IFormItemProps>, formRef: IFormRef) => JSX.Element; // 表单值创建组件
  defaultItemProps?: IItemProps; // FormItem 默认配置
  initialValues?: IInitialValues; // 表单初始值
  defaultFieldsValue?: object; // 表单默认值
  deleteNullValue?: boolean; // 删除空值
}

let FormComponent: React.SFC<IFormProps & FormComponentProps> = (
  {
    form,
    boxClassName,
    className,
    onSub,
    onErr,
    children,
    defaultItemProps,
    initialValues,
    defaultFieldsValue,
    deleteNullValue,
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
  const formRef: IFormRef = { submit, reset, resetSubmit, form };

  // 暴露提交表单方法
  useImperativeHandle(ref, () => formRef, []);

  return (
    <ConfigProvider getPopupContainer={() => box.current || document.body}>
      <div ref={box} className={boxClassName}>
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
export const Form = (FormOld.create as any)()(FormComponent) as React.ComponentClass<IFormProps>;

export default Form;
