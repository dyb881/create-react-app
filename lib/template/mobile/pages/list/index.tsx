import React from 'react';
import { Icon } from 'antd-mobile';
import { IRoute } from 'types';

export default class extends React.Component<IRoute> {
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
