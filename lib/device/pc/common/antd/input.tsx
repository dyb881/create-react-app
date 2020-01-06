import React from 'react';
import { Input as InputOld, InputNumber as InputNumberOld, AutoComplete as AutoCompleteOld } from 'antd';
import { InputProps, SearchProps, TextAreaProps } from 'antd/es/input';
import { InputNumberProps } from 'antd/es/input-number';
import { AutoCompleteProps } from 'antd/es/auto-complete';
import classNames from 'classnames';
import { TInputNotRequired } from '../types';

/**
 * 文本框
 */
export class Input extends React.Component<InputProps> {
  render() {
    return <InputOld maxLength={64} autoComplete="off" {...this.props} />;
  }
}

/**
 * 大文本框
 */
export class TextArea extends React.Component<TextAreaProps> {
  render() {
    const { value = '', maxLength = 255, className, ...props } = this.props;
    return (
      <div className={classNames('dyb-textArea', className)}>
        <InputOld.TextArea rows={4} maxLength={maxLength} value={value} {...props} />
        <p>
          {('' + value).length} / {maxLength}
        </p>
      </div>
    );
  }
}

/**
 * 密码输入框
 */
export class Password extends React.Component<InputProps> {
  render() {
    return <InputOld.Password maxLength={64} autoComplete="current-password" {...this.props} />;
  }
}

/**
 * 搜索框
 */
export class Search extends React.Component<SearchProps> {
  render() {
    return <InputOld.Search maxLength={64} enterButton {...this.props} />;
  }
}

type TInputNumberProps = InputNumberProps & {
  unit?: string | JSX.Element;
  minus?: boolean;
};

/**
 * 数字文本框
 */
export class InputNumber extends React.Component<TInputNumberProps> {
  render() {
    const { unit, minus, className, ...props } = this.props;
    return (
      <div className={classNames('dyb-inputNumber', className)}>
        <InputNumberOld min={minus ? -99999999 : 0} max={99999999} step={1} precision={0} {...props} />
        {unit && <span className="dyb-unit">{unit}</span>}
      </div>
    );
  }
}

/**
 * 自动完成
 */
export class AutoComplete extends React.Component<AutoCompleteProps> {
  render() {
    return (
      <AutoCompleteOld
        filterOption={(inputValue, option: any) =>
          option.props.children.toUpperCase().includes(inputValue.toUpperCase())
        }
        {...this.props}
      />
    );
  }
}

export type TInputInterceptProps = TInputNotRequired & {
  onIntercept(onChange: (value: any) => void): (value: any) => void;
  onConvert?: (value: any) => any;
  children: JSX.Element;
};

/**
 * 输入拦截器
 */
export class InputIntercept extends React.Component<TInputInterceptProps> {
  render() {
    const { onIntercept, onConvert, children, value, onChange } = this.props;
    return (
      <>
        {React.cloneElement(children, {
          value: onConvert && onConvert(value),
          onChange: onChange && onIntercept(onChange),
        })}
      </>
    );
  }
}

type TInputMultilineProps = TInputNotRequired<any[]> & {
  children: JSX.Element;
  delButton?: JSX.Element; // 删除按钮
  addButton?: JSX.Element; // 添加按钮
  fixed?: boolean; // 固定数组
};

/**
 * 多行输入字段
 */
export class InputMultiline extends React.Component<TInputMultilineProps> {
  setValue = (value: any[]) => {
    const { onChange } = this.props;
    onChange && onChange(value);
  };

  add = () => {
    const { value = [] } = this.props;
    this.setValue([...value, undefined]);
  };

  del = (index: number) => {
    let { value = [] } = this.props;
    value = [...value];
    value.splice(index, 1);
    this.setValue(value);
  };

  onChange = (index: number) => (e: any) => {
    let { value = [] } = this.props;
    value = [...value];
    value[index] = e && e.target ? e.target.value : e;
    this.setValue(value);
  };

  render() {
    const { delButton, addButton, children, value = [], fixed } = this.props;
    return (
      <>
        {value.map((val: any, index: number) => (
          <div className="dyb-input-multiline-item" key={index}>
            <div>
              {React.cloneElement(children, {
                value: val,
                onChange: this.onChange(index),
              })}
            </div>
            {fixed ||
              React.cloneElement(delButton || <span>删除</span>, {
                onClick: () => this.del(index),
              })}
          </div>
        ))}
        {fixed ||
          React.cloneElement(addButton || <span>添加</span>, {
            onClick: this.add,
          })}
      </>
    );
  }
}
