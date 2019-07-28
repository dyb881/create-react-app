import React from 'react';
import { Table as TableOld, Pagination as PaginationOld, Popover } from 'antd';
import { TableProps } from 'antd/es/table';
import { PaginationProps } from 'antd/es/pagination';

/**
 * 默认分页配置
 */
const defaultPaginationProps = {
  showTotal: (total: number) => `总计 ${total} 条`, // 统计信息
  showQuickJumper: true, // 跳转
  showSizeChanger: true, // pageSize 变动
  pageSizeOptions: ['10', '20', '30', '50', '100'], // pageSize 候选列表，默认为 10
};

/**
 * 表格
 * 默认使用 id 作为 key
 * 追加分页默认配置
 */
export const Table: React.SFC<TableProps<any>> = ({ pagination, ...props }) => (
  <TableOld
    rowKey="id"
    pagination={
      pagination === false
        ? false
        : {
            ...defaultPaginationProps,
            ...pagination,
          }
    }
    {...props}
  />
);

/**
 * 分页
 * 追加分页默认配置
 */
export const Pagination: React.SFC<PaginationProps> = props => (
  <div className="dyb-pagination">
    <PaginationOld {...defaultPaginationProps} {...props} />
  </div>
);

/**
 * 长文本隐藏
 * 不换行溢出隐藏，鼠标 hover 显示所有内容
 */
export const tableTextAreaRender = (title: string, text: string) => {
  const content = <div style={{ maxWidth: 600, maxHeight: 600, overflow: 'auto' }}>{text}</div>;
  return (
    <Popover placement="topLeft" title={title} content={content} trigger="hover" overlayStyle={{ maxWidth: 600 }}>
      <div className="dyb-table-text-area-render">
        <div>{text}</div>
      </div>
    </Popover>
  );
};
