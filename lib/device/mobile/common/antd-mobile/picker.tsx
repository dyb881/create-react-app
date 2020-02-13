import React, { useMemo } from 'react';
import { List, Picker as PickerSource } from 'antd-mobile';
import { PickerPropsType } from 'antd-mobile/es/picker/PropsType';
import { toOptions } from '../tool';
import { TOptionsProps } from '../types';

/**
 * 选择器
 */
export const Picker: React.FC<Partial<PickerPropsType> & TOptionsProps> = ({ options = [], children, ...props }) => {
  const pickerData = useMemo(() => toOptions(options), [JSON.stringify(options)]);

  return (
    <PickerSource cols={1} data={pickerData} {...props}>
      <List.Item arrow="horizontal">{children}</List.Item>
    </PickerSource>
  );
};
