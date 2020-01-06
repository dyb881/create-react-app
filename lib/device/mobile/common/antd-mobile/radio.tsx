import React, { useMemo } from 'react';
import { List, Radio as RadioSource } from 'antd-mobile';
import { ListProps } from 'antd-mobile/es/list';
import { RadioItemProps } from 'antd-mobile/es/radio/RadioItem';
import { toOptions, TOptionsProps } from '../tool';
import { TInputNotRequired } from '../types';

const { RadioItem } = RadioSource;

type TRadioOption = RadioItemProps & {
  value: number | string;
  label: React.ReactNode;
};

type TRadioProps = TInputNotRequired<TRadioOption['value']> & TOptionsProps<TRadioOption> & ListProps;

/**
 * 单选框
 */
export const Radio: React.FC<TRadioProps> = ({ options = [], value, onChange, ...props }) => {
  const radios = useMemo(() => toOptions(options), [JSON.stringify(options)]);

  return (
    <List {...props}>
      {radios.map(({ label, value: val, ...i }) => (
        <RadioItem
          key={val}
          checked={value === val}
          onChange={() => {
            console.log(val);
            onChange && onChange(val);
          }}
          {...i}
        >
          {label}
        </RadioItem>
      ))}
    </List>
  );
};
