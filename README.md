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

## 状态管理

目前只有 mobx

## 模版

### mobx-mobile

移动端模版，在默认基础上添加了 tabbar 底部导航<br>
如果需要使用 postcss-pxtorem 的童鞋，前往 config-overrides.js 去掉注释即可

### mobx-admin

后台管理模版，在默认基础上添加了： antd 强化版、默认后台布局、表数据全局缓存（分页和搜索）、带搜索栏功能的表格页、表单页