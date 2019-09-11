import React from 'react';
import { List, Radio as RadioOld } from 'antd-mobile';
import { RadioItemProps } from 'antd-mobile/es/radio/RadioItem';
import { ListProps } from 'antd-mobile/es/list';
import { toOptions } from './public';
import { IInput } from 'types';

const { RadioItem } = RadioOld;

interface IRadioOption extends RadioItemProps {
  value: number | string;
  label: React.ReactNode;
}

interface IRadioProps extends ListProps, IInput<IRadioOption['value']> {
  options?: IRadioOption[] | (string | number)[] | object;
}

/**
 * 单选框
 */
export class Radio extends React.Component<IRadioProps> {
  render() {
    const { options, value, onChange, ...props } = this.props;
    return (
      <List {...props}>
        {toOptions(options || []).map(({ label, value: val, ...i }) => (
          <RadioItem key={val} checked={value === val} onChange={() => onChange && onChange(val)} {...i}>
            {label}
          </RadioItem>
        ))}
      </List>
    );
  }
}

export default Radio;
