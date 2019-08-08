import React from 'react';
import { Table as TableOld, Pagination as PaginationOld, Popover } from 'antd';
import { TableProps } from 'antd/es/table';
import { PaginationProps } from 'antd/es/pagination';
import { PopoverProps } from 'antd/es/popover';
import classNames from 'classnames';

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
export const Pagination: React.SFC<PaginationProps> = ({ onChange, ...props }) => {
  return (
    <div className="dyb-pagination">
      <PaginationOld {...defaultPaginationProps} onChange={onChange} onShowSizeChange={onChange} {...props} />
    </div>
  );
};

interface ILongTextProps extends React.HTMLProps<HTMLDivElement> {
  popover?: PopoverProps; // 是否气泡展示详情
}

/**
 * 长文本隐藏
 * 不换行溢出隐藏
 * 可选使用气泡展示，默认左上弹出，trigger:hover
 */
export const LongText: React.SFC<ILongTextProps> = ({ children, className, popover, ...props }) => {
  let res = (
    <div className={classNames('dyb-long-text', className)} {...props}>
      <div>{children}</div>
    </div>
  );

  return popover ? (
    <Popover placement="topLeft" trigger="hover" content={children} {...popover}>
      {res}
    </Popover>
  ) : (
    res
  );
};
