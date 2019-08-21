import React from 'react';
import { Link } from 'react-router-dom';

export default class extends React.Component {
  render() {
    return (
      <div className="fill">
        页面 <Link to="/list">go List</Link>
      </div>
    );
  }
}
