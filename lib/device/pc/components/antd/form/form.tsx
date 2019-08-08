import React, { useRef, useMemo, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Form as FormOld, ConfigProvider } from 'antd';
import { FormProps, FormComponentProps } from 'antd/es/form';
import { RcBaseFormProps, WrappedFormUtils } from 'antd/es/form/Form';
import { createFormItem, IFormItemProps } from './create_form_item';
import { IItemProps } from './item';
import classNames from 'classnames';

export interface IFormProps extends FormProps, RcBaseFormProps {
  boxClassName?: string; // box 类名
  onSub?: <T>(values: T) => void; // 提交表单回调
  onErr?: <T>(err: T) => void; // 表单错误回调
  children?: (FormItem: React.SFC<IFormItemProps>, form: WrappedFormUtils) => JSX.Element; // 表单值创建组件
  defaultItemProps?: IItemProps; // FormItem 默认配置
  defaultFieldsValue?: Object; // 表单默认值
}

let FormComponent: React.SFC<IFormProps & FormComponentProps> = (
  { form, boxClassName, className, onSub, onErr, children, defaultItemProps, defaultFieldsValue, ...props },
  ref
) => {
  const box = useRef(null);

  useEffect(() => {
    defaultFieldsValue && form.setFieldsValue(defaultFieldsValue);
  }, []);

  /**
   * 表单 FormItem
   * 用于快速绑定字段生成表单
   */
  const FormItem = useMemo(() => createFormItem(form.getFieldDecorator, defaultItemProps), [
    JSON.stringify(defaultItemProps),
  ]);

  /**
   * 提交表单方法
   */
  const submit = useCallback(() => {
    form.validateFieldsAndScroll((err, values) => {
      err ? onErr && onErr(err) : onSub && onSub(values);
    });
  }, []);

  /**
   * 表单提交执行
   */
  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    submit();
  }, []);

  // 暴露提交表单方法
  useImperativeHandle(ref, () => ({
    submit,
    form,
  }), []);

  return (
    <ConfigProvider getPopupContainer={() => box.current || document.body}>
      <div ref={box} className={boxClassName}>
        <FormOld className={classNames('dyb-form', className)} onSubmit={onSubmit} {...props}>
          {children && children(FormItem, form)}
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
