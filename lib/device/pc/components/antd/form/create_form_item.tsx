import React from 'react';
import { Input } from 'antd';
import { ValidationRule } from 'antd/es/form';
import { WrappedFormUtils, GetFieldDecoratorOptions } from 'antd/es/form/Form';
import { Item, IItemProps } from './item';

export interface IFormItemProps {
  label?: React.ReactNode; // 标签名
  name?: string; // 字段名
  children?: React.ReactNode;
  valuePropName?: string; // 值对应字段
  initialValue?: any; // 默认值
  rules?: true | string | ValidationRule[]; // 验证规则
  validator?: <T>(value: T) => string | undefined; // 额外验证器
  options?: GetFieldDecoratorOptions; // getFieldDecorator(id, options) to options
  itemProps?: IItemProps; // Form.Item to Props
  fill?: boolean; // 占满整行
  select?: boolean; // 是否选择器
  placeholder?: boolean | string | string[]; // 占位符
  [key: string]: any;
}

// 初始值
export interface IInitialValues {
  [key: string]: IFormItemProps['initialValue'];
}

/**
 * 创建表单 Item 组件
 */
export const createFormItem = (
  getFieldDecorator: WrappedFormUtils['getFieldDecorator'],
  defaultItemProps?: IItemProps,
  initialValues?: IInitialValues
) => {
  /**
   * 表单 Item
   * 用于快速绑定字段生成表单
   */
  const FormItem: React.SFC<IFormItemProps> = formItemProps => {
    let {
      label,
      name,
      children,
      valuePropName = 'value',
      initialValue = initialValues && name ? initialValues[name] : undefined,
      rules = [],
      validator,
      options,
      itemProps = defaultItemProps,
      fill,
      select,
      ...props
    } = formItemProps as IFormItemProps;

    // 获取第一个标签和剩余标签
    let [child = name ? <Input /> : undefined, ...other] = children ? React.Children.toArray(children) : [];

    // 当第一个元素为有效 react 组件时，合并 props
    if (React.isValidElement(child)) {
      // 默认提示语
      let text = select ? '请选择' : '请输入';
      // 接入label，如 label:用户名 = 请输入用户名
      if (typeof label === 'string') text += label;

      // placeholder 和 rules，当值 == true 时，读取对方的值，若对方的值也为 true，则使用默认提示语
      if (props.placeholder === true) props.placeholder = typeof rules === 'string' ? rules : text;
      if (rules === true) rules = typeof props.placeholder === 'string' ? props.placeholder : text;

      // 给第一个标签写入额外参数
      child = React.cloneElement(child, props);

      if (name) {
        // 自动加入必填提示
        if (typeof rules === 'string') rules = [{ required: true, message: rules }];

        // 追加验证器
        rules.push({
          validator: (_rule, value, callback) => {
            let msg;
            // 不可提交空格
            if (value && typeof value === 'string' && !space.test(value)) msg = '不可提交空格';
            // 自定义验证器
            if (!msg && validator) msg = validator(value);
            callback(msg);
          },
        });

        // 绑定字段
        child = getFieldDecorator(name, { valuePropName, initialValue, rules, ...options })(child) as JSX.Element;
      }
    }

    return (
      <Item {...itemProps} label={label} fill={fill}>
        {child}
        {other}
      </Item>
    );
  };

  return FormItem;
};

/**
 * 非全空格，即字符串内包含非空格的时候不匹配，一般用于 !space.test('  ') === true 判断字符串是否都是空格
 */
const space = /^[\s\S]*.*[^\s][\s\S]*$/;

export default createFormItem;
