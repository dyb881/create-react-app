import { observable, action, runInAction } from 'mobx';
import { TSetting } from 'components';
import { debounce } from 'lodash';
import { fileToBase64 } from '@dyb881/file';

/**
 * 布局
 */
export default class Layout {
  constructor() {
    this.resize();
    window.addEventListener('resize', debounce(this.resize, 100));
  }

  /**
   * 自动计算左边导航
   */
  @action resize = () => {
    const { innerWidth: w, innerHeight: h } = window;
    this.isMobile = w <= 750;
    this.collapsed = !this.isMobile && !this.setting.hiddenMenu && w <= 1000;
    this.width = w;
    this.height = h;
  };

  @observable width = window.innerWidth; // 屏幕宽度
  @observable height = window.innerHeight; // 屏幕高度
  @observable isMobile = false; // 是否移动端
  @observable collapsed = false;
  @action collapsedChange = () => {
    this.collapsed = !this.collapsed;
  };
  @observable showHeader = false;
  @action showHeaderChange = () => {
    this.showHeader = !this.showHeader;
  };

  /**
   * 页面配置数据
   */
  @observable setting: TSetting = (jsonString => {
    const setting = jsonString ? JSON.parse(jsonString) : {};
    return {
      componentSize: undefined,
      theme: 'dark',
      hiddenMenu: false,
      hiddenHeader: false,
      menuIconTop: 50,
      headerIconRight: 30,
      ...setting,
    };
  })(localStorage['ra-admin-setting']);

  @action setSetting = (pageConfig: Partial<TSetting>) => {
    const setting = { ...this.setting, ...pageConfig };
    localStorage['ra-admin-setting'] = JSON.stringify(setting);
    this.setting = setting;
  };

  @observable previewSrc = '';
  @observable previewType = '';
  @observable previewName = '';
  /**
   * 预览
   */
  preview = async (file: File | string, type = 'image', name = '') => {
    const src = file instanceof File ? await fileToBase64(file) : file;
    runInAction(() => {
      this.previewSrc = src;
      this.previewType = type;
      this.previewName = name;
    });
  };
  @action previewHide = () => {
    this.previewSrc = '';
  };
}
