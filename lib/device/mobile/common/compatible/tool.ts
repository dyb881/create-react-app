import { isAndroid } from './info';

/**
 * 是否在可视区
 */
export const isInView = (el: Element) => {
  const { top, bottom } = el.getBoundingClientRect();
  return top >= 0 && bottom <= window.innerHeight;
};

/**
 * 判断焦点元素是否在可视区
 */
export const activeElementIsInView = () => !!document.activeElement && isInView(document.activeElement);

/**
 * 滚动到可视区域
 */
export const scrollIntoView = (el: Element, delay = 100) => {
  // contentEditable 属性设置或返回元素内容是否可编辑。
  const editable = el.getAttribute('contenteditable');
  const isEditable = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || editable === '' || editable;
  // 可编辑，并不在视图内
  if (isEditable && !isInView(el)) {
    // 让当前的元素滚动到浏览器窗口的可视区域内。
    setTimeout(() => el.scrollIntoView({ block: 'center' }), delay);
  }
};

/**
 * 焦点元素滚动到可视区域
 */
export const activeElementScrollIntoView = () => document.activeElement && scrollIntoView(document.activeElement);

/**
 * 自动 rem
 * 以 100px 为基准，相对 750 进行计算
 */
export const autoRem = (min: number, max: number, isResize?: boolean) => {
  const htmlstyle = window.document.getElementsByTagName('html')[0].style;
  const resize = () => {
    const w = window.innerWidth;
    htmlstyle.fontSize = (((w > max && max) || (w < min && min) || w) / max) * 100 + 'px';
  };
  resize();
  if (isResize) {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }
  return () => {};
};

/**
 * 安卓重定向无效修复
 */
export function locationReplace(url: string) {
  try {
    if (isAndroid && window.history.replaceState) {
      window.history.replaceState(null, window.document.title, url);
      window.history.go(0);
    } else {
      window.location.replace(url);
    }
  } catch (e) {
    window.location.replace(url);
  }
}
