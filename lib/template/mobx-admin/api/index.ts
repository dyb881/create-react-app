import { post, get } from './request';

export const login = (data: any) => post('/login', data, '登录');

/**
 * 对应模块下有多个接口
 * 当模块太多的时候可以分类拓展出多个文件并从该文件导出
 */
export const table = {
  getList: (data: any) => get('/getTableList', data, '获取列表'),
  getInfo: () => get('/getTableInfo', {}, '获取详情'),
};
