import { observable, action, toJS } from 'mobx';

/**
 * 视图
 */
export default class View {
  /**
   * 页面标题
   */
  @observable title: string = window.document.title;
  @action setTitle = (title: string) => {
    window.document.title = this.title = title;
  };

  /**
   * 视图 key 列表
   */
  @observable keys: any = {};
  @action setKey = (key: string, value: any) => {
    this.keys[key] = value;
  };
  @action getKey = (key?: string) => {
    return toJS(key ? this.keys[key] : this.keys);
  };
}
