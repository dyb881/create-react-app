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
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.onload = () => setTimeout(iframe.remove, 0);
    document.body.removeChild(iframe);
  };

  /**
   * tabBar 页面的 key
   * 必要时可动态控制跳转到对应 tab
   */
  @observable tabBarKey = 0;
  @action setTabBarKey = (tabBarKey: number) => {
    this.tabBarKey = tabBarKey;
  };

  /**
   * 动态控制 tabBar 是否隐藏
   */
  @observable tabBarHidden = false;
  @action setTabBarHidden = (tabBarHidden: boolean) => {
    this.tabBarHidden = tabBarHidden;
  };
}
