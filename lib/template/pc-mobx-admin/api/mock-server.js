const mockServer = require('@dyb881/mock-server').default;
const ip = require('ip');

console.log('模拟数据环境：', `http://localhost:3000/?host=http://${ip.address()}`);

// 数据统一返回处理
mockServer(data => ({
  code: 0,
  msg: '模拟数据',
  data,
}))
  .get('/api/admin/account', req => {
    const { pageSize = 10, pageNum = 1, ...query } = req.query;
    return {
      [`list|${pageSize}`]: [
        {
          id: '@id',
          username: '@first',
          nickname: '@name',
          role: '@integer(0, 1)',
          regip: '@ip',
          loginip: '@ip',
          regtime: '@datetime',
          logintime: '@datetime',
          state: '@integer(0, 2)',
          ...query,
        },
      ],
      total: 100,
      pageNum,
    };
  })
  .delay(300, 1000) // 延迟时间
  .init(); // 启动服务
