import React from 'react';
import { inject, observer } from 'mobx-react';
import { IPage } from 'types';
import TabBar from '@dyb881/tab-bar';
import '@dyb881/tab-bar/lib/style.css';
import tabs from 'config/tabs';

@inject('store')
@observer
export default class extends React.Component<IPage> {
  render() {
    const { setKey, getKey } = this.props.store!.view;
    return <TabBar tabs={tabs} transition activeKey={getKey('tab')} onChange={activeKey => setKey('tab', activeKey)} />;
  }
}
