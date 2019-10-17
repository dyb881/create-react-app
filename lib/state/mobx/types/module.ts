import { RouteComponentProps } from 'react-router-dom';
import Store from 'store';

/**
 * 路由组件
 */
export type TRoute<P = {}> = RouteComponentProps<P>;

/**
 * 带 store 组件
 */
export type TStore = {
  store?: Store;
};

/**
 * 页面组件
 * 带 store 和 路由 props
 */
export type TPage<P = {}> = TRoute<P> & TStore;
