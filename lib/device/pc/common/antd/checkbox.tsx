import React from 'react';
import { Checkbox as CheckboxOld } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { toOptions } from '../tool';

/**
 * 多选框
 */
export class Checkbox extends React.Component<CheckboxGroupProps> {
  render() {
    const { options, ...props } = this.props;
    return <CheckboxOld.Group options={toOptions(options || [])} {...props} />;
  }
}

export default Checkbox;
