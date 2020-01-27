import React, { forwardRef, useImperativeHandle } from 'react';
import { Button } from 'antd';
import { SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { RouterPageHeader, TRouterPageHeaderProps } from '../router_component';
import { Page, TPageBoxProps, FormItemMobile } from '../page';
import { FormLayout, TFormLayoutProps } from './components';
import { Interval } from '../../layout';
import { TForm, useForm } from 'common';

export type TPageFormProps = Pick<TPageBoxProps, 'loading'> &
  Pick<TRouterPageHeaderProps, 'extra'> &
  Partial<TFormLayoutProps>;

/**
 * 表格页
 */
export const PageForm = forwardRef<TForm, TPageFormProps>(
  ({ loading, extra, children, maxWidth = 750, cols = [3, 12], ...props }, ref) => {
    const formRef = useForm();
    const { form, reset } = formRef;

    useImperativeHandle(ref, () => formRef);

    const [offset, span] = cols;

    return (
      <Page loading={loading}>
        <RouterPageHeader onBack extra={extra} />
        <FormLayout name="pageForm" {...{ form, maxWidth, cols }} {...props}>
          {children}
          <FormItemMobile wrapperCol={{ span, offset }}>
            <Interval left>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                保存
              </Button>
              <Button icon={<UndoOutlined />} onClick={reset}>
                重置
              </Button>
            </Interval>
          </FormItemMobile>
        </FormLayout>
      </Page>
    );
  }
);
