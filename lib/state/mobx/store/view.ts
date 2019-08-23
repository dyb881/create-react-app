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
  @action setKey = (key: string, value: any) => {
    this.keys[key] = value;
  };

  /**
   * 获取视图 key
   */
  @action getKey = (key?: string) => {
    return toJS(key ? this.keys[key] : this.keys);
  };
}
