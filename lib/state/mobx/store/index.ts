import { configure } from 'mobx';
import View from './view';
import User from './user';

configure({
  enforceActions: 'observed',
});

/**
 * 主状态
 */
export default class Store {
  /**
   * 视图相关管理
   */
  view = new View(this);

  /**
   * 用户管理
   */
  user = new User(this);
}