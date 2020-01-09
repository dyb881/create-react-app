import React from 'react';
import { Dropdown as DropdownSource } from 'antd';
import { DropDownProps, DropdownButtonProps } from 'antd/es/dropdown';
import { Menu, TMenuProps } from './menu';

type TMenuKeys = 'data' | 'onClickItem';

export type TDropdownProps<T = DropDownProps> = Partial<T> &
  Pick<TMenuProps, TMenuKeys> & {
    menuProps?: Omit<TMenuProps, TMenuKeys>;
  };

/**
 * 下拉菜单
 */
export const Dropdown: React.FC<TDropdownProps> = ({ data, onClickItem, menuProps, ...props }) => (
  <DropdownSource overlay={<Menu data={data} onClickItem={onClickItem} {...menuProps} />} {...props} />
);

export type TDropdownButtonProps = TDropdownProps<DropdownButtonProps>;

/**
 * 下拉菜单按钮
 */
export const DropdownButton: React.FC<TDropdownButtonProps> = ({ data, onClickItem, menuProps, ...props }) => (
  <DropdownSource.Button overlay={<Menu data={data} onClickItem={onClickItem} {...menuProps} />} {...props} />
);
