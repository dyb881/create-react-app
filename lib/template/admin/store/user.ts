import { observable, action, when } from 'mobx';
import Store from './';

export default class {
  root: Store;

  constructor(root: Store) {
    this.root = root;
  }

  @observable isLogin: boolean = false; // 登陆状态监听
  @action onLogin = (bind: boolean | (() => void)) => {
    if (typeof bind === 'boolean') {
      this.isLogin = bind;
    } else {
      when(() => this.isLogin, bind);
    }
  };
}
