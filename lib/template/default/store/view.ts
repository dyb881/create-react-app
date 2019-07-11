import { observable, action } from 'mobx';
import Store from './';

export default class {
  root: Store;

  constructor(root: Store) {
    this.root = root;
  }

  @observable title: string = window.document.title; // 页面标题
  @action setTitle = (title: string) => {
    window.document.title = this.title = title;
  };

  @observable keys: any = {};
  @action setKey = (key: string, value: number | string) => {
    this.keys[key] = value;
  };
}
