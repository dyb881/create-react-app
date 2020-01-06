import React, { useMemo } from 'react';
import { List, Checkbox as CheckboxSource } from 'antd-mobile';
import { ListProps } from 'antd-mobile/es/list';
import { CheckboxItemProps } from 'antd-mobile/es/checkbox/CheckboxItem';
import { toOptions, TOptionsProps } from '../tool';
import { TInputNotRequired } from '../types';

const { CheckboxItem } = CheckboxSource;

type TCheckboxOption = CheckboxItemProps & {
  value: number | string;
  label: React.ReactNode;
};

type TCheckboxProps = TInputNotRequired<TCheckboxOption['value'][]> & TOptionsProps<TCheckboxOption> & ListProps;

/**
 * 多选框
 */
export const Checkbox: React.FC<TCheckboxProps> = ({ options = [], value = [], onChange, ...props }) => {
  const createOnChange = (val: TCheckboxOption['value']) => () => {
    const index = value.indexOf(val);
    index > -1 ? value.splice(index, 1) : value.push(val);
    onChange && onChange(value);
  };

  const checkboxs = useMemo(() => {
    return toOptions(options).map(({ label, value, ...i }) => (
      <CheckboxItem key={value} onChange={createOnChange(value)} {...i}>
        {label}
      </CheckboxItem>
    ));
  }, [JSON.stringify(options)]);

  return <List {...props}>{checkboxs}</List>;
};
