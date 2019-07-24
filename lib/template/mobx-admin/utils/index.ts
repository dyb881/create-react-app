import moment from 'moment';

/**
 * 暂停
 */
export const sleep = (outTime: number) => new Promise(r => setTimeout(r, outTime));

/**
 * 根据键值列表获取一个新的对象
 */
export const getKeysData = <T>(data: T, keys: (keyof T)[]) =>
  keys.reduce(
    (v, r) => {
      v[r] = data[r];
      return v;
    },
    {} as T
  );

type TFormatType = 'date' | 'day' | 'endDay';
const formatText = {
  day: 'YYYY-MM-DD 00:00:00',
  endDay: 'YYYY-MM-DD 23:59:59',
  date: 'YYYY-MM-DD HH:mm:ss',
};

/**
 * 转时间字符串
 */
export const format = (date?: moment.Moment, formatType?: TFormatType) =>
  date && date.format(formatText[formatType || 'day']);

/**
 * 批量处理时间字段
 */
export const formats = (data: any, keys: string[], formatType?: TFormatType | TFormatType[]) => ({
  ...data,
  ...keys.reduce((v: any, r, i) => {
    let type;
    if (Array.isArray(formatType)) {
      type = formatType[i] || formatType[0];
    } else if (formatType) {
      type = formatType;
    }
    v[r] = format(data[r], type as TFormatType);
    return v;
  }, {}),
});

/**
 * 转时间对象
 */
export const toMoment = (dateTime?: any): any => (dateTime ? moment(dateTime, moment.ISO_8601) : undefined);
