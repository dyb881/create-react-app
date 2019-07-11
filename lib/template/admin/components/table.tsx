import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, matchPath } from 'react-router-dom';
import { IStore, IRoute } from 'types';
import { Button, Divider } from 'antd';
import { FormBoxSearch, IFormBoxProps, Table, PageHeader } from './antd';
import { TableProps } from 'antd/es/table';
import menuData from 'config/menuData';

/**
 * 全局托管表格数据（分页、查询数据）
 * 这样跳转页面后返回，也会保留分页和查询数据。
 */

interface IFormBoxSearchsProps extends IFormBoxProps, IStore {
  dataKey: string;
  onChange?: () => void;
}

/**
 * 全局表格
 * 统一查询表单
 */
@inject('store')
@observer
export class FormBoxSearchs extends React.Component<IFormBoxSearchsProps> {
  formBox: any;

  componentDidMount() {
    const { store, dataKey } = this.props;
    const search = store!.view.getTableData(dataKey, 'search');
    this.formBox.props.form.setFieldsValue(search);
  }

  onSub = async (values: any) => {
    const { store, dataKey, onChange } = this.props;
    const page = store!.view.getTableData(dataKey, 'page');
    store!.view.setTableData(this.props.dataKey, {
      search: values,
      page: {
        ...page,
        current: 1, // 回到第一页
      },
    });
    onChange && onChange();
  };

  reset = () => {
    this.formBox.props.form.resetFields();
    this.formBox.submit();
  };

  render() {
    const { store, dataKey, onChange, children, ...props } = this.props;
    return (
      <FormBoxSearch {...props} onSub={this.onSub} onRef={formBox => (this.formBox = formBox!)}>
        {ValueItem => (
          <>
            {children(ValueItem)}
            <ValueItem>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={this.reset}>重置</Button>
            </ValueItem>
          </>
        )}
      </FormBoxSearch>
    );
  }
}

interface ITableProps extends TableProps<any>, IStore {
  dataKey: string;
}

/**
 * 全局表格
 * 统一分页表格
 */
@inject('store')
@observer
export class Tables extends React.Component<ITableProps> {
  render() {
    const { store, dataKey, pagination, onChange, ...props } = this.props;
    const { getTableData, setTableData } = store!.view;
    const tablePagination: any = {
      ...getTableData(dataKey, 'page'),
      ...pagination,
    };
    if (tablePagination.pageSize > 10) tablePagination.position = 'both';
    return (
      <Table
        key={tablePagination.position}
        pagination={tablePagination}
        onChange={(pagination: any, filters: any, sorter: any, extra: any) => {
          const { pageSize, current } = pagination;
          setTableData(dataKey, { pageSize, current }, 'page');
          onChange && onChange(pagination, filters, sorter, extra);
        }}
        {...props}
      />
    );
  }
}

interface IPageHeadersProps extends IRoute {
  [key: string]: any;
}

/**
 * 自动生成标题
 */
class PageHeadersOld extends React.Component<IPageHeadersProps> {
  getTitle = (pathname: string, three = menuData) => {
    let list: string[] = [];
    three.forEach((i: any) => {
      if (matchPath(pathname, { path: i.to, exact: true })) {
        list.push(i.title);
      } else if (i.item) {
        const titleList = this.getTitle(pathname, i.item);
        if (titleList.length) list = [i.title, ...titleList];
      }
    });
    return list;
  };

  get getTitleText() {
    return this.getTitle(this.props.location.pathname).join(' > ');
  }

  render() {
    const { location, history, match, ...props } = this.props;
    return <PageHeader {...props} title={this.getTitleText} />;
  }
}

export const PageHeaders = withRouter(PageHeadersOld);

/**
 * 分割线
 */
export const DividerVertical: React.SFC = () => <Divider type="vertical" />;
