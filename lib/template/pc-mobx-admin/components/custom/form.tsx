import React, { useRef, useCallback } from 'react';
import { Button } from 'antd';
import { Form, IFormProps } from '../antd';

/**
 * 搜索表单
 * 用于表格页面搜索栏
 */
export const FormSearch: React.SFC<IFormProps> = ({ children, ...props }) => {
  const formRef = useRef<any>(null);

  /**
   * 重置清空表单，并再次提交表单
   */
  const reset = useCallback(() => {
    const { form, submit } = formRef.current;
    form.resetFields();
    submit();
  }, [!formRef.current]);

  return (
    <Form layout="inline" {...props} wrappedComponentRef={formRef}>
      {(Item, _form) => (
        <>
          {children && children(Item, _form)}
          <Item label="" itemProps={{ style: { marginRight: 0 } }}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button onClick={reset}>重置</Button>
          </Item>
        </>
      )}
    </Form>
  );
};
