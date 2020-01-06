import React, { useMemo } from 'react';
import { List, Picker as PickerSource } from 'antd-mobile';
import { PickerPropsType } from 'antd-mobile/es/picker/PropsType';
import { toOptions, TOptionsProps } from '../tool';

/**
 * 选择器
 */
export const Picker: React.FC<Partial<PickerPropsType> & TOptionsProps> = ({ options = [], children, ...props }) => {
  const data = useMemo(() => toOptions(options), [JSON.stringify(options)]);

  return (
    <PickerSource cols={1} data={data} {...props}>
      <List.Item arrow="horizontal">{children}</List.Item>
    </PickerSource>
  );
};
