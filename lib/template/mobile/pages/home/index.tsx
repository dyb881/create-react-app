import React from 'react';
import { Link } from 'react-router-dom';

export default class extends React.Component {
  render() {
    return (
      <div>
        <p>首页</p>
        <Link to="/list">跳转列表</Link>
      </div>
    );
  }
}
