import React from 'react';
import { Form, Modal, ConfigProvider, Button } from 'antd';
import { ValidationRule, FormItemProps, FormProps } from 'antd/es/form';
import { WrappedFormUtils, GetFieldDecoratorOptions } from 'antd/es/form/Form';
import { ModalProps } from 'antd/es/modal';
import { Input, InputIntercept, IInputInterceptProps } from './input';

/**
 * 把比例写入到对象
 */
const ratioToProps = (props: any, ratio: string) => {
  const ratios = ratio.split(':');
  return {
    ...props,
    labelCol: { span: +ratios[0] || 0 },
    wrapperCol: { span: +ratios[1] || 0 },
  };
};

interface IValueItemProps {
  label?: React.ReactNode; // 标签名
  name?: string; // 字段名
  valuePropName?: string; // 值字段
  rules?: true | string | ValidationRule[]; // 验证规则
  validator?: (value: any) => string | undefined; // 额外验证器
  initialValue?: any; // 默认值
  intercept?: IInputInterceptProps['intercept']; // 输入拦截器
  children?: JSX.Element | JSX.Element[];
  ratio?: string; // 比值
  fill?: boolean; // 占满整行
  itemProps?: FormItemProps;
  options?: GetFieldDecoratorOptions;
  [key: string]: any;
}

// 非全空格，即字符串内包含非空格的时候不匹配，一般用于 !space.test('  ') === true 判断字符串是否都是空格
const space = /^[\s\S]*.*[^\s][\s\S]*$/;

/**
 * 创建字段组件
 */
const createValueItem = (getFieldDecorator: WrappedFormUtils['getFieldDecorator']): React.SFC<IValueItemProps> => ({
  label,
  name,
  valuePropName = 'value',
  rules = [],
  validator,
  initialValue,
  intercept,
  children,
  ratio,
  fill,
  itemProps = {},
  options,
  ...props
}) => {
  if (!label) {
    label = <span />;
    itemProps = {
      colon: false,
      ...itemProps,
    };
  }

  let text = '请输入';
  if (typeof label === 'string') text += label;

  if (props.placeholder === true) props.placeholder = typeof rules === 'string' ? rules : text;
  if (rules === true) rules = typeof props.placeholder === 'string' ? props.placeholder : text;

  // 自动加入必填提示
  if (typeof rules === 'string') {
    rules = [{ required: true, message: rules }];
  }

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

  // 占满整行
  if (fill) {
    itemProps = {
      ...itemProps,
      style: { width: '100%', ...itemProps.style },
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    };
  }

  // 转化比例
  if (ratio) itemProps = ratioToProps(itemProps, ratio);

  // 参数写入
  let [child, ...other] = React.Children.map(children || <Input />, child => {
    child = React.cloneElement(child, props);
    if (intercept) child = <InputIntercept intercept={intercept}>{child}</InputIntercept>;
    return child;
  });

  return (
    <Form.Item label={label} {...itemProps}>
      {name
        ? getFieldDecorator(name, { rules, initialValue, validateFirst: true, valuePropName, ...options })(child)
        : child}
      {other}
    </Form.Item>
  );
};

export interface IFormBoxProps extends FormProps {
  onSub?: (values: any) => void; // 提交表单回调
  onErr?: (err: any) => void; // 表单错误回调
  onForm?: (form: WrappedFormUtils) => void; // 获取表单数据对象
  onRef?: (formBox: FormBoxOld) => void; // 获取表单组件
  children: (ValueItem: React.SFC<IValueItemProps>) => JSX.Element; // 表单值创建组件
  type?: 'default' | 'inline';
  ratio?: string; // 比值 default 1:3
  submitButton?: boolean; // 默认提交按钮
}

interface IFormBoxOldProps extends IFormBoxProps {
  form: WrappedFormUtils;
}

class FormBoxOld extends React.Component<IFormBoxOldProps> {
  ValueItem = createValueItem(this.props.form.getFieldDecorator);

  componentDidMount() {
    const { onForm, form, onRef } = this.props;
    onForm && onForm(form);
    onRef && onRef(this);
  }

  submit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    const { form, onSub, onErr } = this.props;
    form.validateFieldsAndScroll((err: any, values: any) => {
      if (err) {
        onErr && onErr(err);
      } else {
        onSub && onSub(values);
      }
    });
  };

  render() {
    const {
      onSub,
      onErr,
      onForm,
      onRef,
      children,
      ratio = '8:14',
      type,
      form,
      className,
      submitButton,
      ...props
    } = this.props;

    const formProps = type === 'inline' ? { ...props, layout: 'inline' } : ratioToProps(props, ratio);

    return (
      <Form onSubmit={this.submit} className={['dyb-form', className].join(' ')} {...formProps}>
        {children(this.ValueItem)}
        {submitButton && (
          <ValueItem fill>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </ValueItem>
        )}
      </Form>
    );
  }
}

/**
 * 表单模块
 */
export const FormBox = (Form.create as any)()(FormBoxOld) as React.ComponentClass<IFormBoxProps>;

/**
 * 搜索栏表单
 */
export const FormBoxSearch: React.SFC<IFormBoxProps> = (props: IFormBoxProps) => <FormBox type="inline" {...props} />;

interface IModalProps extends ModalProps {
  showButton: JSX.Element; // 弹出按钮
  children: IFormBoxProps['children'];
  onSub?: (values: any) => Promise<boolean | undefined>; // 提交表单回调，返回 true 则隐藏弹窗
  onShow?: () => void; // 显示回调，常用于表单值初始化
  onHide?: () => void; // 隐藏回调
  formProps?: any; // 表单 props
}

interface IModalState {
  visible: boolean;
  loading: boolean;
}

/**
 * 弹出层表单
 */
export class FormBoxModal extends React.Component<IModalProps, IModalState> {
  state = { visible: false, loading: false };

  formBox?: any;

  onShow = () => this.setState({ visible: true }, this.props.onShow);
  onHide = () => this.setState({ visible: false }, this.props.onHide);
  onOk = () => this.formBox.submit();

  onSub = async (values: any) => {
    const state: any = { loading: true };
    this.setState(state);
    const { onSub } = this.props;
    if (onSub) state.visible = !(await onSub(values));
    state.loading = false;
    this.setState(state);
  };

  onRef = (formBox: any) => {
    const { formProps } = this.props;
    this.formBox = formBox;
    formProps && formProps.onRef && formProps.onRef(formBox);
  };

  render() {
    const { showButton, onShow, onHide, onSub, children, formProps, ...props } = this.props;
    const { visible, loading } = this.state;
    return (
      <>
        {React.cloneElement(showButton, { onClick: this.onShow })}
        <ConfigProvider getPopupContainer={() => window.document.body}>
          <Modal
            onCancel={this.onHide}
            onOk={this.onOk}
            visible={visible}
            confirmLoading={loading}
            maskClosable={false}
            destroyOnClose
            {...props}
          >
            <FormBox {...formProps} onSub={this.onSub} onRef={this.onRef}>
              {children}
            </FormBox>
          </Modal>
        </ConfigProvider>
      </>
    );
  }
}
