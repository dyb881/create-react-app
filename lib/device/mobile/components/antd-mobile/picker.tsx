import React from 'react';
import { List, Picker as PickerOld } from 'antd-mobile';
import { PickerPropsType } from 'antd-mobile/es/picker/PropsType';

/**
 * 选择器
 */
export class Picker extends React.Component<PickerPropsType> {
  render() {
    const { children, ...props } = this.props;
    return (
      <PickerOld {...props} cols={1}>
        <List.Item arrow="horizontal">{children}</List.Item>
      </PickerOld>
    );
  }
}

export default Picker;
