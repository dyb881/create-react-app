import React from 'react';
import { Radio as RadioOld } from 'antd';
import { RadioGroupProps } from 'antd/es/radio';
import { toOptions } from './select';

interface IProps extends RadioGroupProps {
  isButton?: boolean; // 启用按钮样式
}

/**
 * 单选框
 */
export class Radio extends React.Component<IProps> {
  Item: any = RadioOld;

  constructor(props: IProps) {
    super(props);
    this.Item = props.isButton ? RadioOld.Button : RadioOld;
  }

  render() {
    const { Item } = this;
    const { options, isButton, ...props } = this.props;
    return (
      <RadioOld.Group buttonStyle="solid" {...props}>
        {toOptions(options || []).map(({ label, ...i }) => (
          <Item key={'' + i.value} {...i}>
            {label}
          </Item>
        ))}
      </RadioOld.Group>
    );
  }
}

export default Radio;
