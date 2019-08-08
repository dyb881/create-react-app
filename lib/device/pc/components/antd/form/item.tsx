import React, { useMemo } from 'react';
import { Form } from 'antd';
import { FormItemProps } from 'antd/es/form';

export interface IItemProps extends FormItemProps {
  width?: number; // 0 - 1，宽度比值
  ratio?: string; // 比值，例：8:16 冒号两边的值和 < 24，该值用于使用 antd 的栅格
  fill?: boolean; // 是否填满
}

/**
 * 表单 Item
 */
export const Item: React.SFC<IItemProps> = ({ width, ratio, fill, label, style, labelCol, wrapperCol, ...props }) => {
  // 计算 Props
  const computeProps = useMemo(() => {
    if (ratio) {
      // 计算占比栅格
      const ratios = ratio.split(':').map(i => +i || 0);

      // 计算占满时，所占栅格
      if (fill && width) {
        const residue = 24 - ratios[0] - ratios[1];
        ratios[0] *= width;
        ratios[1] = 24 - ratios[0] - residue * width;
      }

      // 写入占比栅格
      labelCol = { span: ~~ratios[0], ...labelCol };
      wrapperCol = { span: ~~ratios[1], ...wrapperCol };
    }

    // 计算宽度
    if (width) {
      style = { width: `${fill ? 100 : 100 * width}%`, ...style };
    }

    return {
      // label 为空时，需要保持占位，并
      label: label === undefined ? <span /> : label,
      // 去掉冒号：
      colon: !!label,
      style,
      // 设置占比栅格
      labelCol,
      wrapperCol,
    };
  }, [
    width,
    ratio,
    fill,
    label,
    JSON.stringify(style),
    JSON.stringify(labelCol),
    JSON.stringify(wrapperCol),
  ]) as IItemProps;

  return <Form.Item {...computeProps} {...props} />;
};

export default Item;
