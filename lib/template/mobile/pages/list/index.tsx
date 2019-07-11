import React from 'react';
import { Icon } from 'antd-mobile';
import { IRoute } from 'types';

export default class extends React.Component<IRoute> {
  render() {
    return (
      <div>
        <p onClick={this.props.history.goBack}>
          <Icon type="left" />
        </p>
        列表
      </div>
    );
  }
}
