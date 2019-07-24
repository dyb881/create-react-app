import { observable, action, when } from 'mobx';
import Store from './';

/**
 * 用户管理
 */
export default class User {
  root: Store;

  constructor(root: Store) {
    this.root = root;
  }

  /**
   * 是否登录
   */
  @observable isLogin: boolean = false;

  /**
   * 登陆状态监听
   */
  @action onLogin = (bind: boolean | (() => void)) => {
    if (typeof bind === 'boolean') {
      this.isLogin = bind;
    } else {
      when(() => this.isLogin, bind);
    }
  };
}
