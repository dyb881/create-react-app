import React from 'react';
import { inject, observer } from 'mobx-react';
import { TPage } from 'types';
import TabBar from '@dyb881/tab-bar';
import '@dyb881/tab-bar/lib/style.css';
import tabs from 'config/tabs';

@inject('store')
@observer
export default class extends React.Component<TPage> {
  render() {
    const { view } = this.props.store!;
    return <TabBar tabs={tabs} transition activeKey={view.tab} onChange={activeKey => view.setTab(activeKey)} />;
  }
}
