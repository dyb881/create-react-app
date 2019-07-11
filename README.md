# create-react-app

## 介绍

基于 [react-app](https://github.com/dyb881/react-app) 开发的一个项目起始模版<br>
遵守目录结构限制，可以让项目更加易于管理<br>
[更多文档](https://github.com/dyb881/react-app)

## 安装

```
npm i -g @dyb881/create-react-app
cra i
```

## 模版介绍

目前一共有三个模版

### default

默认模版，仅添加了 mobx 状态管理。

### mobile

移动端模版，在默认的基础上添加了 tabbar 底部导航

### admin

后台管理模版，在默认基础上添加了： antd 强化版、默认后台布局、表数据全局缓存（分页和搜索）、带搜索栏功能的表格页、表单页

## 目录结构

- src - 源代码，开发项目过程中，一般只会动这里的代码
  - api - 请求相关，可直接导出请求函数，以及封装后的接口
    - request.ts - 配置导出请求方法
    - index.ts - 封装并导出请求接口
  - components - 全局组件，会被页面复用的组件
  - config - 全局配置
    - request.ts - 请求配置
    - routers.ts - 路由配置
  - images - 图片资源
  - pages - 项目页面 - 开发中，以页面为单位的文件夹都存放于此
  - types - ts 类型定义，以及引用第三方库类型声明
  - utils - 工具库
  - App.less - 全局样式定义
  - App.tsx - 项目入口，主要用于状态的注入，和路由定义
  - react-app-env.d.ts - 全局声明

### 生命周期

---

目前开发模式中，最有意义和必要的一个项目生命周期就是登陆<br>
即使是不需要登陆的项目，很大几率都是需要特定规定数据准备好后才可执行某些请求。<br>

```
store.user.onLogin(true); // 登录
store.user.onLogin(false); // 注销
store.user.onLogin(() => { // 登录监听
  // 登录后执行
  // 需要登录后才发出的异步请求都需要在登录监听内执行
});
```
