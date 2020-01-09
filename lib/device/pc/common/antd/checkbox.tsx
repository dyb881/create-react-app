import React, { useMemo } from 'react';
import { Checkbox as CheckboxSource } from 'antd';
import { CheckboxGroupProps, CheckboxOptionType } from 'antd/es/checkbox';
import { toOptions, TOptionsProps } from '../tool';

export type TCheckboxProps = Omit<CheckboxGroupProps, 'options'> & TOptionsProps<CheckboxOptionType>;

/**
 * 多选框
 */
export const Checkbox: React.FC<TCheckboxProps> = ({ options = [], ...props }) => {
  const checkboxGroupOptions = useMemo(() => toOptions(options), [JSON.stringify(options)]);

  return <CheckboxSource.Group options={checkboxGroupOptions} {...props} />;
};
