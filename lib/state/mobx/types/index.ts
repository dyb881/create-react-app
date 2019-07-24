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
