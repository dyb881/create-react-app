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
    const { keys, setKey } = this.props.store!.view;
    return <TabBar tabs={tabs} transition activeKey={keys.tab} onChange={activeKey => setKey('tab', activeKey)} />;
  }
}
