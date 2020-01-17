import React from 'react';
import { Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { TInputNotRequired } from 'common';

export type TFormListProps = TInputNotRequired<any[]> & {
  children: JSX.Element;
  addButton?: JSX.Element; // 新增行按钮
  delButton?: JSX.Element; // 删除行按钮
  [key: string]: any;
};

/**
 * 多行输入字段
 */
export const FormList: React.FC<TFormListProps> = ({
  value = [],
  onChange,
  children,
  addButton = (
    <Button type="dashed" block>
      <PlusOutlined /> Add field
    </Button>
  ),
  delButton = <MinusCircleOutlined style={{ margin: '0 8px', fontSize: 16 }} />,
  ...props
}) => {
  return (
    <>
      {value.map((i, k) => {
        const childProps = {
          ...props,
          value: i,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            value[k] = e && e.target ? e.target.value : e;
            onChange?.([...value]);
          },
        };

        return (
          <div className="center" key={k} style={{ marginBottom: 5 }}>
            <div style={{ flex: 1 }}>{React.cloneElement(children, childProps)}</div>
            {React.cloneElement(delButton, {
              onClick: () => {
                value.splice(k, 1);
                onChange?.([...value]);
              },
            })}
          </div>
        );
      })}
      {React.cloneElement(addButton, {
        onClick: () => {
          onChange?.([...value, undefined]);
        },
      })}
    </>
  );
};
