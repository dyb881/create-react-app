import { UAParser } from 'ua-parser-js';

/**
 * 浏览器解析器
 */
export const { ua, browser, engine, os, device } = new UAParser().getResult();

export const isIOS = os.name === 'iOS';

export const isAndroid = os.name === 'Android';
