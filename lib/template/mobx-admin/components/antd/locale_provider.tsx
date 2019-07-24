import React from 'react';
import { LocaleProvider as LocaleProviderOld } from 'antd';
import zh_CN from 'antd/es/locale-provider/zh_CN';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

/**
 * 设置为中文简体
 */
export const LocaleProvider: React.SFC<any> = props => <LocaleProviderOld locale={zh_CN} {...props} />;

export default LocaleProvider;
