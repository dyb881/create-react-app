/// <reference types="react-scripts" />

declare module '*.module.less' {
  const classes: {
    [key: string]: string;
  };
  export default classes;
}

declare interface Window {
  store: any; // 全局缓存状态
}
