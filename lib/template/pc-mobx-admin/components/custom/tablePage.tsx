/**
 * 表格页
 */
import React, { useReducer, useCallback } from 'react';
import { Button, Divider } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { Form, IFormProps } from '../antd';
import { pick } from 'lodash';

/**
 * 表格页数据
 */
interface IPage {
  search: object; // 搜索值
  current: number; // 当前页面
  pageSize: number; // 每页展示多少条数据
}

/**
 * 表格页 Hooks 配置
 */
interface IUseTableConfig {
  page?: IPage; // 页面数据
  onPage?: (page: IPage) => void; // 页面数据变动回调
  defaultSearch?: object; // 默认搜索信息
}

/**
 * 表格页 Hooks
 * 自定义 Hooks，内置表格页常用数据
 * 默认 state
 *  search           object   搜索值
 *  current          number   当前页面
 *  pageSize         number   每页展示多少条数据
 *  total            number   页面总数
 *  dataSource       any[]    表格数据
 *  selectedRowKeys  string[]    表格数据
 */
export const useTable = (config: IUseTableConfig) => {
  const { page, onPage, defaultSearch } = config;
  const [state, dispatch] = useReducer(
    (state, newState) => {
      const res = { ...state, ...newState };
      // 页面数据变动回调
      onPage && onPage(pick(res, ['search', 'current', 'pageSize']));
      return res;
    },
    {
      // 写入默认搜索信息
      search: defaultSearch,
      current: 1,
      pageSize: 10,
      // 写入页面数据
      ...page,
      total: 0, // 页面总数
      dataSource: [], // 表格数据
      selectedRowKeys: [], // 选中行
    }
  );

  const { search, current, pageSize, total } = state;

  /**
   * 表单提交
   */
  const onSub = useCallback((search: any) => dispatch({ search, current: 1 }), []);

  /**
   * 搜索表单配置
   */
  const formSearchProps = { showButton: true, initialValues: defaultSearch, defaultFieldsValue: search, onSub };

  /**
   * 分页变动
   */
  const onChange = useCallback((current: number, pageSize?: number) => dispatch({ current, pageSize }), []);

  /**
   * 分页配置
   */
  const paginationProps = { current, pageSize, total, onChange };

  /**
   * use 监听条件，数组的任意一个值发生变动时，执行对应更新
   */
  const use = [current, pageSize, JSON.stringify(search)];

  return { state, dispatch, use, formSearchProps, paginationProps };
};

interface IFormSearchProps extends IFormProps {
  showButton?: boolean; // 展示默认按钮
  refresh?: () => void; // 刷新按钮回调
}

/**
 * 搜索栏表单
 */
export const FormSearch: React.SFC<IFormSearchProps> = ({ children, showButton, refresh, ...props }) => (
  <Form layout="inline" deleteNullValue {...props}>
    {(Item, formRef) => (
      <>
        {children && children(Item, formRef)}
        {showButton && (
          <Item label="" fill htmlType="submit">
            <Button type="primary">搜索</Button>
            <Button onClick={formRef.resetSubmit}>重置</Button>
            {refresh && <Button onClick={refresh}>刷新</Button>}
          </Item>
        )}
      </>
    )}
  </Form>
);

/**
 * 计算所有列之和，并追加宽度
 */
export const toScrollX = (columns: ColumnProps<any>[], additional: number) =>
  columns.reduce((v, i) => (+i.width! || 0) + v, 0) + additional;

/**
 * 动作组件，自动添加分割线
 */
export const Action: React.SFC = ({ children }) => (
  <>
    {React.Children.map(children, (child, index) => (
      <>
        {index > 0 && <Divider type="vertical" />}
        {child}
      </>
    ))}
  </>
);
