import { once } from 'lodash';

/**
 * 插入样式
 */
export const installLink = (href: string) =>
  new Promise((r) => {
    const script = document.createElement('link');
    script.rel = 'Stylesheet';
    script.href = href;
    script.onload = () => r();
    document.body.appendChild(script);
  });

/**
 * 插入脚本
 */
export const installScript = (src: string) =>
  new Promise((r) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => r();
    document.body.appendChild(script);
  });

/**
 * 单次限制
 */
export const installLinkOne = (href: string) => once(() => installLink(href));
export const installScriptOne = (src: string) => once(() => installScript(src));

/**
 * 读取cookies
 */
export const getCookie = (name: string) => {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  let arr = document.cookie.match(reg);
  return arr ? decodeURI(arr[2]) : null;
};

/**
 * 批量读取cookies
 */
export const getCookies = (names: string[]) =>
  names.reduce((o: string[], i) => {
    o[o.length] = getCookie(i)!;
    return o;
  }, []);

/**
 * 转换为树状数据
 */
export const toThree = (data: any[], pid?: string): any[] => {
  const root: any[] = []; // 根数组
  const childrens: any[] = []; // 子数组

  if (pid) {
    data.forEach((i) => (pid === i.pid ? root : childrens).push(i));
  } else {
    const ids = data.map((i) => i.id);
    data.forEach((i) => (ids.includes(i.pid) ? childrens : root).push(i));
  }

  return root.map((i) => {
    const children = toThree(childrens, i.id);
    return children.length ? { ...i, children } : i;
  });
};

/**
 * 树状数据禁用
 */
export const treeDisabled = (treeData: any[], disabled: string) => {
  return treeData.map((i) => {
    if ([i.id, i.pid].includes(disabled)) i.disabled = true;
    if (i.children) i.children = treeDisabled(i.children, i.disabled ? i.id : disabled);
    return i;
  });
};
