# create-react-app

## 介绍

基于 react-app 开发的一个项目起始模版<br>
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

移动端模版，在默认基础上添加了 tabbar 底部导航<br>
如果需要使用 postcss-pxtorem 的童鞋，前往 config-overrides.js 去掉注释即可

### admin

后台管理模版，在默认基础上添加了： antd 强化版、默认后台布局、表数据全局缓存（分页和搜索）、带搜索栏功能的表格页、表单页

### 生命周期

---

目前开发模式中，最有意义和必要的一个项目生命周期就是登陆<br>
即使是不需要登陆的项目，很大几率都是需要特定规定数据准备好后才可执行某些请求。<br>
以下是示意代码，不代表必须这么使用

```
store.user.onLogin(true); // 登录
store.user.onLogin(false); // 注销
store.user.onLogin(() => { // 登录监听
  // 登录后执行
  // 需要登录后才发出的异步请求都需要在登录监听内执行
});
```
