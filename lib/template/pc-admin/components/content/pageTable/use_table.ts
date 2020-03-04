import { useRef, useCallback, useEffect } from 'react';
import { autorun } from 'mobx';
import { TForm, useStates, stores } from 'common';
import { TPaginationMobilePropsOnChange } from './components';

/**
 * 表格状态
 */
export type TUseTableStates = {
  search: object; // 搜索内容
  current: number; // 当前页码
  pageSize: number; // 每页展示多少条数据
  total: number; // 数据总数
  dataSource: any[]; // 表格数据
  selectedRowKeys: React.ReactText[]; // 选中行
  loading: boolean | string; // 加载中
  [key: string]: any;
};

export type TUseTableOptions = {
  defaultStates?: Partial<TUseTableStates>; // 默认状态
  tableDataKey?: string; // 表格数据 key
};

/**
 * 表格页 Hooks
 * 自定义 Hooks，内置表格页常用数据
 */
export const useTable = (getList: () => void, options?: TUseTableOptions) => {
  const { getTableData, setTableData } = stores.view;
  const { defaultStates, tableDataKey = 'root' } = options || {};
  const formRef = useRef<TForm>(null);
  const { states, setStates } = useStates<TUseTableStates>({
    search: {},
    current: 1,
    pageSize: 20,
    total: 0,
    dataSource: [],
    selectedRowKeys: [],
    loading: false,
    ...defaultStates, // 写入默认值
    ...getTableData(tableDataKey), // 获取表格缓存数据
  });
  const { search, current, pageSize, total, dataSource, selectedRowKeys, loading } = states;

  useEffect(() => {
    // 写入默认值
    formRef.current?.form.setFieldsValue(search);

    return autorun(() => {
      // 根据窗口宽度调整 pageSize
      stores.view.isMobile && setStates({ pageSize: 20 });
    });
  }, []);

  /**
   * use 监听条件，数组的任意一个值发生变动时，执行对应更新
   */
  const useList = [current, pageSize, JSON.stringify(search)];

  /**
   * 根据监听刷新数据
   */
  useEffect(() => {
    // 缓存表格数据
    setTableData(tableDataKey, { search, current, pageSize });
    // 请求数据
    stores.user.onLogin(getList);
  }, useList);

  /**
   * 设置加载状态
   */
  const setLoading = useCallback((loading: TUseTableStates['loading']) => setStates({ loading }), []);

  /**
   * 表单提交
   */
  const onFinish = useCallback((search: TUseTableStates['search']) => setStates({ search, current: 1 }), []);

  /**
   * 分页变动
   */
  const paginationOnChange = useCallback<TPaginationMobilePropsOnChange>(
    (current, pageSize) => setStates({ current, pageSize }),
    []
  );

  /**
   * 表格选中
   */
  const rowSelectionOnChange = useCallback(
    (selectedRowKeys: TUseTableStates['selectedRowKeys']) => setStates({ selectedRowKeys }),
    []
  );

  /**
   * 表格页
   */
  const pageTableProps = {
    // 分页配置
    paginationProps: { current, pageSize, total, onChange: paginationOnChange },
    dataSource,
    loading,
    reload: getList,
    rowSelection: { selectedRowKeys, onChange: rowSelectionOnChange },
  };

  /**
   * 搜索框
   */
  const formSearchProps = {
    onFinish,
    ref: formRef,
  };

  return { states, setStates, setLoading, pageTableProps, formSearchProps, useList, getList };
};
