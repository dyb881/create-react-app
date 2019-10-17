import React from 'react';
import { Icon } from 'antd-mobile';
import { TRoute } from 'types';

export default class extends React.Component<TRoute> {
  render() {
    return (
      <div>
        <span onClick={this.props.history.goBack}>
          <Icon type="left" />
        </span>
        列表
      </div>
    );
  }
}
