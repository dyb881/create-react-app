import { configure } from 'mobx';
import View from './view';
import User from './user';

configure({
  enforceActions: 'observed',
});

// 主状态
export default class {
  view = new View(this); // 视图相关管理
  user = new User(this); // 用户管理
}
