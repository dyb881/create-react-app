import { observable, action, toJS } from 'mobx';
import Store from './';

/**
 * 视图相关管理
 */
export default class View {
  root: Store;

  constructor(root: Store) {
    this.root = root;
  }

  /**
   * 页面标题
   */
  @observable title: string = window.document.title;

  /**
   * 更新标题
   */
  @action setTitle = (title: string) => {
    window.document.title = this.title = title;
  };

  /**
   * 视图 key 列表
   */
  @observable keys: any = {};

  /**
   * 更新视图 key
   */
  @action setKey = (key: string, value: number | string) => {
    this.keys[key] = value;
  };

  @observable tableDatas: ITableDatas = {}; // 表格对应数据
  @action setTableData = (key: string, data: any, type?: TTableDataType) => {
    const tableDatas = toJS(this.tableDatas);
    let tableData = { ...tableDatas[key] };
    if (type) tableData[type] = data;
    else tableData = data;
    tableDatas[key] = tableData;
    this.tableDatas = tableDatas;
  };
  getTableData = (key: string, type?: TTableDataType) => {
    const tableDatas = toJS(this.tableDatas);
    const tableData = { ...tableDatas[key] };
    return type
      ? { ...tableData[type] }
      : {
          page: {},
          search: {},
          ...tableData,
        };
  };
}

type TTableDataType = 'page' | 'search';

interface ITableDatas {
  [key: string]: ITableData;
}

interface ITableData {
  // 分页数据
  page: {
    pageSize: number; // 每页有多少条数据
    current: number; // 当前第几页
  };
  search: any; // 查询数据
}
