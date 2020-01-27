import React, { useState, useRef, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Divider, ConfigProvider, Pagination, Checkbox, Popover } from 'antd';
import { FormProps } from 'antd/es/form';
import { TableProps } from 'antd/es/table';
import { ColumnsType, ColumnGroupType } from 'antd/es/table/interface';
import { PaginationProps } from 'antd/es/pagination';
import { PopoverProps } from 'antd/es/popover';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { TForm, useForm, useStates, combine } from 'common';
import { FormMobile, ButtonMobile } from '../page';
import { VirtualTable } from './virtual_table';
import { Interval } from '../../layout';
import { jsonParse, jsonStringify } from '@dyb881/json';
import { debounce } from 'lodash';
import classNames from 'classnames';
import style from './style.module.less';

export type TFormSearchProps = FormProps & {
  buttons?: React.ReactNode; // 追加按钮
};

/**
 * 搜索表单
 */
export const FormSearch = forwardRef<TForm, TFormSearchProps>(({ children, className, buttons, ...props }, ref) => {
  const formRef = useForm();
  const { form, resetSubmit } = formRef;

  useImperativeHandle(ref, () => formRef);

  return (
    <FormMobile form={form} layout="inline" className={classNames(style.formSearch, className)} {...props}>
      {children}
      <Interval>
        <ButtonMobile type="primary" icon={<SearchOutlined />} htmlType="submit">
          搜索
        </ButtonMobile>
        <ButtonMobile icon={<UndoOutlined />} onClick={resetSubmit}>
          重置
        </ButtonMobile>
        {buttons}
      </Interval>
    </FormMobile>
  );
});

let timeout: NodeJS.Timeout;

export type TTableMobileProps = Omit<TableProps<any>, 'columns'> & {
  columns: Exclude<TableProps<any>['columns'], undefined>;
  widthAddition?: number; // 列宽度之和的前提上追加宽度
  key?: React.Attributes['key'];
};

/**
 * 表格
 * 默认使用 id 作为 key
 * 并自动计算高度
 */
export const TableMobile = combine<TTableMobileProps>(({ stores, columns, scroll, widthAddition = 0, ...props }) => {
  const box = useRef<HTMLDivElement>(null);
  const { states, setStates } = useStates({});
  const { y, width, ...styles } = states;
  const { collapsed, pageConfig, isMobile } = stores.view;

  const resize = useCallback(() => {
    timeout && clearTimeout(timeout);
    if (!box.current) return;
    const { firstElementChild, offsetTop, nextElementSibling, clientHeight } = box.current;
    if (stores.view.isMobile) {
      const height = firstElementChild?.clientHeight;
      setStates({ height });
      timeout = setTimeout(() => {
        setStates({ height: undefined, y: undefined });
      }, 300);
      return;
    }

    setStates({ height: clientHeight, width: window.innerWidth - 32 - (stores.view.collapsed ? 80 : 200) });
    let height = window.innerHeight - offsetTop - 82;
    if (nextElementSibling) height -= nextElementSibling.clientHeight + 16;
    const [thead] = firstElementChild?.getElementsByTagName('thead');
    setStates({ height, y: height - thead.clientHeight });
  }, []);

  useEffect(() => {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(resize, 300);
  }, [pageConfig.componentSize, collapsed]);

  useEffect(() => {
    resize();
    const resizeDebounce = debounce(resize, 300);
    window.addEventListener('resize', resizeDebounce);
    return () => window.removeEventListener('resizeDebounce', resizeDebounce);
  }, []);

  const { dataSource } = props;

  // 列宽之和，用于横向滚动
  const x = useMemo(() => toScrollX(columns) + widthAddition, [columns.length, widthAddition]);

  // 移动端访问过滤浮动列
  const mergedColumns = useMemo(() => (isMobile ? columns.map(({ fixed, ...column }) => column) : columns), [isMobile]);

  const tableProps: TTableMobileProps = {
    key: x,
    rowKey: 'id',
    pagination: false,
    columns: mergedColumns,
    scroll: { x, y, ...scroll },
    ...props,
  };

  return (
    <div ref={box} className="transition" style={styles}>
      {dataSource!?.length > 100 ? <VirtualTable tableWidth={width} {...tableProps} /> : <Table {...tableProps} />}
    </div>
  );
});

export type TPaginationMobilePropsOnChange = (current: number, pageSize: number) => void;

export type TPaginationMobileProps = Omit<PaginationProps, 'onChange' | 'onShowSizeChange'> & {
  onChange?: TPaginationMobilePropsOnChange;
};

/**
 * 自适应分页组件
 */
export const PaginationMobile = combine<TPaginationMobileProps>(({ stores, onChange, ...props }) => {
  const { pageConfig, isMobile } = stores.view;
  return (
    <ConfigProvider componentSize="middle">
      <div className={style.pagination}>
        <Pagination
          size={pageConfig.componentSize}
          simple={isMobile}
          showQuickJumper
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100', '200', '500', '1000']}
          showTotal={total => `总计 ${total} 条`}
          onChange={onChange as any}
          onShowSizeChange={onChange}
          {...props}
        />
      </div>
    </ConfigProvider>
  );
});

export type TColumnsSettingProps = PopoverProps & {
  columns: ColumnsType;
  value: string[];
  onChange: (hides: string[]) => void;
};

/**
 * 列展示设置
 */
export const ColumnsSetting = forwardRef<Popover, TColumnsSettingProps>(
  ({ columns, value, onChange, ...props }, ref) => {
    const { length } = value;
    const isAll = !length; // 是否全选

    const clear = useCallback(() => onChange([]), []);

    const title = useMemo(
      () => (
        <div className={style.columnsSetting}>
          <Checkbox checked={isAll} indeterminate={!isAll} onClick={clear}>
            列展示
          </Checkbox>
        </div>
      ),
      [isAll]
    );

    const content = useMemo(
      () => (
        <>
          {columns.map((i, k) => {
            const key = '' + (i.dataIndex || i.key || k);
            const index = value.indexOf(key);
            const checked = index === -1;

            return (
              <div className={`between-center ${style.columnsSetting}`} key={key}>
                <Checkbox
                  checked={checked}
                  onClick={() => {
                    checked ? value.push(key) : value.splice(index, 1);
                    onChange([...value]);
                  }}
                >
                  {i.title}
                </Checkbox>
                <span>{i.width || 'auto'}</span>
              </div>
            );
          })}
        </>
      ),
      [length]
    );

    return <Popover placement="bottomRight" title={title} content={content} trigger="click" ref={ref} {...props} />;
  }
);

/**
 * 列展示设置 Hooks
 */
export const useColumnsSetting = (columns: ColumnsType) => {
  const { pathname } = useLocation();
  // 读取浏览器数据
  const [value, onChange] = useState<string[]>(jsonParse(localStorage[`columns_setting_${pathname}`], []));

  // 记录数据到浏览器
  useEffect(() => {
    localStorage[`columns_setting_${pathname}`] = jsonStringify(value);
  }, [value.length]);

  const columnsSettingProps = { columns, value, onChange };

  const columnsHides = useMemo(() => {
    return columns.filter((i, k) => {
      const key = '' + (i.dataIndex || i.key || k);
      return !value.includes(key);
    });
  }, [value.length]);

  return { columnsSettingProps, columnsHides };
};

/**
 * 动作组件，自动添加分割线
 */
export const Action: React.FC = ({ children }) => (
  <>
    {React.Children.map(children, (child, index) => (
      <>
        {index > 0 && <Divider type="vertical" />}
        {child}
      </>
    ))}
  </>
);

/**
 * 计算所有列之和，并追加宽度
 */
export const toScrollX = (columns: ColumnsType) => {
  return columns.reduce((v, i) => {
    let sum = (+i.width! || 0) + v;
    const { children } = i as ColumnGroupType<any>;
    if (children) sum += toScrollX(children);
    return sum;
  }, 0);
};
