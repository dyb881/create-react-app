import { observable, action } from 'mobx';
import { TUseTableStates } from 'components';
import { jsonParse } from '@dyb881/json';
import { debounce } from 'lodash';

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
      this.isMobile = false;
      this.collapsed = w <= 1000;
    }
  };

  @observable isMobile = false; // 是否移动端
  @observable collapsed = false;
  @action siderOnChange = () => {
    this.collapsed = !this.collapsed;
  };

  /**
   * 页面配置数据
   */
  @observable pageConfig: TPageConfig = jsonParse(localStorage['ra-admin-pageConfig'], {
    componentSize: undefined,
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

  /**
   * 页面标题
   */
  @observable title = window.document.title;
  @action setTitle = (title: string) => {
    window.document.title = this.title = title;
  };

  /**
   * 表格数据临时储存
   */
  tableDatas: TTableDatas = {};
  setTableData = (key: string, value?: TTableData) => {
    if (value) {
      this.tableDatas[key] = value;
    } else {
      delete this.tableDatas[key];
    }
  };
  getTableData = (key: string) => {
    return this.tableDatas[key];
  };
}

/**
 * 页面配置
 */
type TPageConfig = {
  componentSize: 'large' | 'middle' | 'small'; // 全局组件尺寸
  theme: 'light' | 'dark'; // 主题色
  hiddenMenu: boolean; // 隐藏菜单
  hiddenHeader: boolean; // 默认隐藏头部
  menuIconTop: number; // 菜单开关按钮位置
  headerIconRight: number; // 页头开关按钮位置
};

/**
 * 表格数据
 */
type TTableData = Pick<TUseTableStates, 'search' | 'current' | 'pageSize'>;

/**
 * 仅允许全部写入和清空
 */
type TTableDatas = { [key: string]: TTableData };
