import { RouteComponentProps } from 'react-router-dom';
import Store from 'store';

/**
 * 带 store 组件
 */
export interface IStore {
  store?: Store;
}

/**
 * 路由页面组件
 */
export interface IRoute<P = {}> extends RouteComponentProps<P> {}

/**
 * 页面组件
 * 带 store 和 路由 props
 */
export interface IPage<P = {}> extends IStore, IRoute<P> {}

// 分页组件状态
export interface IPageState {
  data: any[];
  total: number;
  loading: boolean | string;
  selectedRowKeys: string[] | number[];
}

// 默认数据
export const defaultPageState = {
  data: [],
  total: 0,
  loading: false,
  selectedRowKeys: [],
};
