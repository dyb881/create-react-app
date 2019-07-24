import React from 'react';
import { Dropdown, Menu, Button } from 'antd';

interface IDropdownButtonData extends React.HTMLProps<HTMLAnchorElement> {
  text: string;
}

interface IDropdownButtonProps {
  data: IDropdownButtonData[];
  [key: string]: any;
}

/**
 * 按钮列表，常用于批量操作
 */
export const DropdownButton: React.SFC<IDropdownButtonProps> = ({ data, children, ...props }) => {
  const menu = (
    <Menu>
      {data.map(({ text, ...i }, k) => (
        <Menu.Item key={k}>
          <a {...i}>{text}</a>
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown overlay={menu} placement="bottomRight" {...props}>
      <Button>{children}</Button>
    </Dropdown>
  );
};

export default DropdownButton;
