import React from 'react';
import { Icon } from 'antd-mobile';
import { TRoute } from 'types';
import style from './style.module.less';

export default class extends React.Component<TRoute> {
  render() {
    return (
      <div className={`fill ${style.box}`}>
        <div className={`center ${style.header}`}>
          <span className={`center ${style.left}`} onClick={this.props.history.goBack}>
            <Icon type="left" />
          </span>
          列表
        </div>
        列表页
      </div>
    );
  }
}
