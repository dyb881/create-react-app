import React, { forwardRef, useImperativeHandle } from 'react';
import { Button } from 'antd';
import { SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { TForm, useForm, TSpinProps } from 'common';
import { RouterPageHeader, TRouterPageHeaderProps, FormItemMobile, Interval, Loading } from '../layout';
import { FormLayout, TFormLayoutProps } from './common';

export type TPageFormProps = Pick<TSpinProps, 'loading'> &
  Pick<TRouterPageHeaderProps, 'extra'> &
  Partial<TFormLayoutProps>;

/**
 * 表格页
 */
export const PageForm = forwardRef<TForm, TPageFormProps>(
  ({ loading, extra, children, maxWidth = 750, cols = [3, 16], ...props }, ref) => {
    const formRef = useForm();
    const { form, reset } = formRef;

    useImperativeHandle(ref, () => formRef);

    const [offset, span] = cols;

    return (
      <>
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
        <Loading loading={loading} />
      </>
    );
  }
);
