import React from 'react';
import { Dropdown, Menu, Button } from 'antd';

type TDropdownButtonData = React.HTMLProps<HTMLAnchorElement> & {
  text: string;
};

type TProps = {
  data: TDropdownButtonData[];
  [key: string]: any;
};

/**
 * 配置生成按钮列表，常用于批量操作
 */
export const DropdownButton: React.SFC<TProps> = ({ data, children, ...props }) => {
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
