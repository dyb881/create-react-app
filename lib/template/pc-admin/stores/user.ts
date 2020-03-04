import { observable, action, when } from 'mobx';
import { modalConfirm } from 'common';

/**
 * 用户
 */
export default class User {
  /**
   * 是否登录
   */
  @observable isLogin = false;

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

  @observable info: any = {};

  /**
   * 登录
   */
  login = () => {
    this.onLogin(true);
  };

  /**
   * 退出登录
   */
  logout = () => {
    this.onLogin(false);
  };

  /**
   * 注销对话框
   */
  logoutConfirm = () => {
    modalConfirm({
      title: '确定要退出登录吗？',
      okButtonProps: { danger: true },
      onOk: this.logout,
    });
  };
}
