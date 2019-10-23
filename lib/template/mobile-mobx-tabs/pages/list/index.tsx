import React from 'react';
import { inject, observer } from 'mobx-react';
import { PageBox } from 'components';
import { TPage } from 'types';

const Page: React.SFC<TPage> = () => {
  return <PageBox>列表页</PageBox>;
};

export default inject('store')(observer(Page));
