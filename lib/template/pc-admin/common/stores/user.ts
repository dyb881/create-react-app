import { observable, action, when, computed } from 'mobx';
import { modalConfirm } from 'common';
import { auth } from 'apis';
import { message } from 'antd';

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

  @observable access_token = localStorage.access_token;
  @observable info: any = {};
  @computed get Authorization() {
    return `Bearer ${this.access_token}`;
  }

  /**
   * 显示登录页面
   */
  @computed get showLogin() {
    return !this.isLogin && !this.access_token;
  }

  /**
   * 登录
   */
  @action login = ({ access_token, ...info }: any) => {
    Object.assign(localStorage, { access_token });
    Object.assign(this, { access_token, info, isLogin: true });
  };

  /**
   * 退出登录
   */
  @action logout = () => {
    Object.assign(this, { access_token: '', info: {}, isLogin: false });
    localStorage.removeItem('access_token');
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

  /**
   * 自动登录
   */
  autoLogin = async () => {
    if (!this.access_token) return;
    message.loading('自动登录', 0);
    const res = await auth.getInfo(`Bearer ${this.access_token}`);
    message.destroy();
    if (!res.ok) {
      message.error('登录超时');
      this.logout();
      return;
    }
    this.login({ access_token: this.access_token, ...res.data });
  };
}
