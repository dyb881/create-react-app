import React from 'react';
import { inject, observer } from 'mobx-react';
import { IPage } from 'types';
import { message, Button } from 'antd';
import { Box, BoxItem, PageHeaders, FormBox, TextArea } from 'components';
import { sleep } from 'utils';
import { table } from 'api';

interface IState {
  loading: boolean | string;
}

@inject('store')
@observer
export default class extends React.Component<IPage, IState> {
  form?: any;
  state = { loading: false };

  componentDidMount() {
    this.props.store!.user.onLogin(this.getData);
  }

  getData = async () => {
    this.setState({ loading: '加载详情' });
    const res = await table.getInfo();
    this.setState({ loading: false });
    if (res.ok) {
      const { Batch, Description } = res.data;
      this.form.setFieldsValue({ Batch, Description });
    }
  };

  onSub = async (value: any) => {
    const state: any = { loading: '提交数据' };
    console.log(value);
    this.setState(state);
    await sleep(500);
    message.success('保存成功');
    state.loading = false;
    this.setState(state);
  };

  render() {
    return (
      <Box loading={this.state.loading}>
        <BoxItem>
          <PageHeaders onBack={this.props.history.goBack} />
          <FormBox onSub={this.onSub} onForm={form => (this.form = form)} submitButton>
            {ValueItem => (
              <>
                <ValueItem label="批次号" name="Batch" rules placeholder fill />
                <ValueItem label="描述" name="Description" rules placeholder fill>
                  <TextArea />
                </ValueItem>
              </>
            )}
          </FormBox>
        </BoxItem>
      </Box>
    );
  }
}
