import { observable, action } from 'mobx';
import { debounce } from 'lodash';
import { jsonParse } from '@dyb881/json';

/**
 * 视图
 */
export default class View {
  constructor() {
    this.resize();
    window.addEventListener('resize', debounce(this.resize, 100));
  }

  /**
   * 自动计算左边导航
   */
  @action resize = () => {
    const { innerWidth: w } = window;
    if (w <= 750) {
      this.isMobile = true;
      this.collapsed = false;
    } else {
      this.isMobile = this.pageConfig.hiddenMenu;
      this.collapsed = w <= 1000;
    }
  };

  /**
   * 页面配置数据
   */
  @observable pageConfig: TPageConfig = jsonParse(localStorage['ra-admin-pageConfig'], {
    theme: 'dark',
    hiddenMenu: false,
    hiddenHeader: false,
    menuIconTop: 50,
    headerIconRight: 30,
  });
  @action setPageConfig = (pageConfig: TPageConfig) => {
    this.pageConfig = pageConfig;
    localStorage['ra-admin-pageConfig'] = JSON.stringify(pageConfig);
    this.resize();
  };

  @observable isMobile = this.pageConfig.hiddenMenu;
  @observable collapsed = false;
  @action siderOnChange = () => {
    this.collapsed = !this.collapsed;
  };

  /**
   * 页面标题
   */
  @observable title: string = window.document.title;
  @action setTitle = (title: string) => {
    window.document.title = this.title = title;
  };
}

type TPageConfig = {
  theme: 'light' | 'dark';
  hiddenMenu: boolean; // 隐藏菜单
  hiddenHeader: boolean; // 默认隐藏头部
  menuIconTop: number; // 菜单开关按钮位置
  headerIconRight: number; // 页头开关按钮位置
};
