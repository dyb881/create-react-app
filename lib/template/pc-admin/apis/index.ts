import { post, get } from 'common';

/**
 * 对应模块下有多个接口
 * 当模块太多的时候可以分类拓展出多个文件并从该文件导出
 */
export const admin = {
  account: {
    getList: (data: any) => get('/admin/account', data, '获取管理员账号列表'),
    details: (id: string) => get('/admin/account/details', { id }, '获取管理员账号详情'),
    edit: (data: any) => post('/admin/account/edit', data, '编辑管理员账号'),
    add: (data: any) => post('/admin/account/add', data, '添加管理员账号'),
  },
};
