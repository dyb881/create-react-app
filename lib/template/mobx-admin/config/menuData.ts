/**
 * 左侧导航数据和标题数据
 */
export const menuData = [
  {
    to: '/table',
    title: '表格页面',
    icon: 'table',
    item: [
      {
        to: '/table/info',
        title: '表单页面',
      },
    ],
  },
  {
    to: '/info',
    title: '表单页面',
    icon: 'form',
  },
].map((i: any) => {
  i.onClick = () => {
    window.store.view.setTableData('root', {}); // 还原表格数据
  };
  return i;
});

export default menuData;
