import React from 'react';
import { inject, observer } from 'mobx-react';
import { Page, RouterPageHeader } from 'components';
import { TStore } from 'types';

@inject('store')
@observer
export default class extends React.Component<TStore> {
  componentDidMount() {
    // this.props.store!.view.loading();
  }

  render() {
    return (
      <Page>
        <RouterPageHeader />
      </Page>
    );
  }
}
