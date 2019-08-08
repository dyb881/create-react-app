import React from 'react';
import { inject, observer } from 'mobx-react';
import { Page } from 'components';
import { IStore } from 'types';

@inject('store')
@observer
export default class extends React.Component<IStore> {
  componentDidMount() {
    // this.props.store!.view.loading();
  }

  render() {
    return <Page></Page>;
  }
}
