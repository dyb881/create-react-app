import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { TPage } from 'types';

const Page: React.SFC<TPage> = () => {
  return (
    <>
      我的 <Link to="/list">go List</Link>
    </>
  );
};

export default inject('store')(observer(Page));
