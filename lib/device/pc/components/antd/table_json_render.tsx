import React from 'react';
import { Popover } from 'antd';
import ReactJson from 'react-json-view';

/**
 * 长文本隐藏
 * 不换行溢出隐藏，鼠标 hover 显示所有内容
 * 展示形式为 json 格式
 */
export const tableJsonRender = (title: string, json: any) => {
  const text = JSON.stringify(json);
  const content = (
    <div style={{ maxHeight: 600, overflow: 'auto' }}>
      <ReactJson src={json} name={null} displayDataTypes={false} />
    </div>
  );
  return (
    <Popover placement="topLeft" title={title} content={content} trigger="hover" overlayStyle={{ maxWidth: 600 }}>
      <div className="dyb-table-text-area-render">
        <div>{text}</div>
      </div>
    </Popover>
  );
};
