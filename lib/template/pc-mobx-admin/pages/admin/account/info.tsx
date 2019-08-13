import React from 'react';
import { inject, observer } from 'mobx-react';
import { Page, RouterPageHeader } from 'components';
import { IStore } from 'types';

const InfoPage: React.SFC<IStore> = () => {
  return (
    <Page>
      <RouterPageHeader />
      <div>asd</div>
    </Page>
  );
};

export default inject('store')(observer(InfoPage));
