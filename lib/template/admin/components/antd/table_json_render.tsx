import React from 'react';
import { Popover } from 'antd';
import ReactJson from 'react-json-view';

// json 数据展示
export const tableJsonRender = (title: string, json: any, max = 30) => {
  const text = JSON.stringify(json);
  const content = (
    <div style={{ maxHeight: 600, overflow: 'auto' }}>
      <ReactJson src={json} name={null} displayDataTypes={false} />
    </div>
  );
  return (
    <Popover placement="topRight" title={title} content={content} trigger="hover" overlayStyle={{ maxWidth: 800 }}>
      <span style={{ cursor: 'pointer' }}>
        {text.substr(0, max)}
        {text.length > max && '...'}
      </span>
    </Popover>
  );
};
