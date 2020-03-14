import { observable, action } from 'mobx';

/**
 * 视图
 */
export default class View {
  /**
   * 页面标题
   */
  @observable title = window.document.title;
  @action setTitle = (title: string) => {
    window.document.title = this.title = title;
  };

  /**
   * 表格数据临时储存
   */
  tableDatas: any = {};
  setTableData = (key: string, value?: any) => {
    if (value) {
      this.tableDatas[key] = value;
    } else {
      delete this.tableDatas[key];
    }
  };
  getTableData = (key: string) => {
    return this.tableDatas[key];
  };
}
