import React from 'react';
import { Table as TableOld, Pagination as PaginationOld, Popover as PopoverOld } from 'antd';
import { TableProps } from 'antd/es/table';
import { PaginationProps } from 'antd/es/pagination';

/**
 * 默认分页配置
 */
const defaultPaginationProps = {
  showTotal: (total: number) => `总计 ${total} 条`,
  showQuickJumper: true,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '30', '50', '100'],
};

/**
 * 表格
 */
export const Table: React.SFC<TableProps<any>> = ({ className, pagination, ...props }) => (
  <TableOld
    rowKey="id"
    className={['dyb-table', className].join(' ')}
    pagination={{
      ...defaultPaginationProps,
      ...pagination,
    }}
    {...props}
  />
);

/**
 * 分页
 */
export const Pagination: React.SFC<PaginationProps> = props => (
  <div className="dyb-pagination">
    <PaginationOld {...defaultPaginationProps} {...props} />
  </div>
);

/**
 * 长文本隐藏
 */
export const tableTextAreaRender = (title: string, text: string, max = 10) => {
  if (typeof text === 'string' && text.length > max) {
    const content = <div style={{ maxWidth: 600, maxHeight: 600, overflow: 'auto' }}>{text}</div>;
    return (
      <PopoverOld placement="topRight" title={title} content={content} trigger="hover" overlayStyle={{ maxWidth: 600 }}>
        <span style={{ cursor: 'pointer' }}>{text.substr(0, max)}...</span>
      </PopoverOld>
    );
  }
  return text;
};
