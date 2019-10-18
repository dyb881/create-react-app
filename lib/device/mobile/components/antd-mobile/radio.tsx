import React from 'react';
import { List, Radio as RadioOld } from 'antd-mobile';
import { RadioItemProps } from 'antd-mobile/es/radio/RadioItem';
import { ListProps } from 'antd-mobile/es/list';
import { toOptions } from './public';
import { TInputNotRequired } from 'types';

const { RadioItem } = RadioOld;

type TRadioOption = RadioItemProps & {
  value: number | string;
  label: React.ReactNode;
};

type TRadioProps = ListProps &
  TInputNotRequired<TRadioOption['value']> & {
    options?: TRadioOption[] | (string | number)[] | object;
  };

/**
 * 单选框
 */
export class Radio extends React.Component<TRadioProps> {
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
