import React from 'react';
import { InputItem } from 'antd-mobile';
import { Field } from 'rc-field-form';
import { FieldProps } from 'rc-field-form/es/Field';

export type TFormItemProps = Pick<FieldProps, 'name' | 'children' | 'rules'> & {
  hidden?: boolean; // 隐藏表单项
  label?: React.ReactNode; // 标签名
  validator?: (value: any) => string | undefined | Promise<string | undefined>; // 额外验证器
  select?: boolean; // 是否选择器
  required?: boolean | string; // 是否必填
  placeholder?: boolean | string | string[]; // 占位符
  fieldProps?: FieldProps;
  [key: string]: any;
};

export const FormItem: React.FC<TFormItemProps> = ({
  hidden,
  label,
  validator,
  select,
  required,
  placeholder,
  name,
  children = name ? <InputItem>{label}</InputItem> : undefined,
  rules = [],
  fieldProps,
  ...props
}) => {
  // 隐藏表单项
  if (hidden) return null;

  // 默认提示语
  let text = select ? '请选择' : '请输入';
  // 接入label，如 label:用户名 = 请输入用户名
  if (typeof label === 'string') text += label;

  // 加入必填提示
  if (required) {
    rules.push({
      required: true,
      message: required !== true ? required : typeof placeholder === 'string' ? placeholder : text,
    });
  }

  // 写入默认占位符
  if (placeholder) {
    props.placeholder = placeholder !== true ? placeholder : typeof required === 'string' ? required : text;
  }

  // 追加验证器
  rules.push({
    validator: async (_rule, value) => {
      let msg;
      // 不可提交空格
      if (value && typeof value === 'string' && !space.test(value)) {
        msg = `${typeof label === 'string' ? label : '输入框'}不可提交空格`;
      }
      // 自定义验证器
      if (!msg && validator) msg = await validator(value);

      msg && (await Promise.reject(msg));
    },
  });

  return (
    <Field name={name} rules={rules} {...fieldProps}>
      {React.isValidElement(children) ? React.cloneElement(children, props) : children}
    </Field>
  );
};

/**
 * 非全空格，即字符串内包含非空格的时候不匹配，一般用于 !space.test('  ') === true 判断字符串是否都是空格
 */
const space = /^[\s\S]*.*[^\s][\s\S]*$/;
