import React from 'react';
import { List, Checkbox as CheckboxOld } from 'antd-mobile';
import { CheckboxItemProps } from 'antd-mobile/es/checkbox/CheckboxItem';
import { ListProps } from 'antd-mobile/es/list';
import { toOptions } from './public';
import { TInputNotRequired } from 'types';

const { CheckboxItem } = CheckboxOld;

interface ICheckboxOption extends CheckboxItemProps {
  value: number | string;
  label: React.ReactNode;
}

interface ICheckboxProps extends ListProps, TInputNotRequired<ICheckboxOption['value'][]> {
  options?: ICheckboxOption[] | (string | number)[] | object;
}

/**
 * 多选框
 */
export class Checkbox extends React.Component<ICheckboxProps> {
  createOnChange = (val: ICheckboxOption['value']) => (e: any) => {
    const { value = [], onChange } = this.props;
    let newValue = [...value];
    const index = value.indexOf(val);
    if (e.target.checked) {
      index === -1 && newValue.push(val);
    } else if (index > -1) {
      newValue.splice(index, 1);
    }
    onChange && onChange(newValue);
  };

  render() {
    const { options, value, onChange, ...props } = this.props;
    return (
      <List {...props}>
        {toOptions(options || []).map(({ label, value, ...i }) => (
          <CheckboxItem key={value} onChange={this.createOnChange(value)} {...i}>
            {label}
          </CheckboxItem>
        ))}
      </List>
    );
  }
}

export default Checkbox;
