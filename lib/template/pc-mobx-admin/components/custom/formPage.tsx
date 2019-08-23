/**
 * 表单页
 */
import React, { useReducer, useCallback } from 'react';
import { Button } from 'antd';
import { Form, IFormProps, FormModal, IFormModalProps } from '../antd';
import { AutoBox } from './layout';

interface IFormPageProps extends IFormProps {
  showButton?: boolean; // 展示默认按钮
}

/**
 * 表单页面
 */
export const FormPage: React.SFC<IFormPageProps> = ({ children, showButton = true, ...props }) => (
  <AutoBox>
    <Form
      defaultItemProps={{
        width: 0.5,
        ratio: '6:16',
      }}
      {...props}
    >
      {(Item, formRef) => (
        <>
          {children && children(Item, formRef)}
          {showButton && (
            <Item fill htmlType="submit">
              <Button type="primary">搜索</Button>
              <Button onClick={formRef.reset}>重置</Button>
            </Item>
          )}
        </>
      )}
    </Form>
  </AutoBox>
);

/**
 * 表单弹窗
 */
export const FormModalPage: React.SFC<IFormModalProps> = ({ formProps = {}, ...props }) => (
  <FormModal
    formProps={{
      ...formProps,
      defaultItemProps: {
        width: 0.5,
        ratio: '6:16',
        ...formProps.defaultItemProps,
      },
    }}
    width={600}
    {...props}
  />
);

/**
 * 表单信息页 Hooks
 * 自定义 Hooks，内置表格页常用数据
 * defaultData: any    表单默认数据
 *
 * 默认 state
 *  data             object   表单数据
 *  loading          boolean  加载状态
 */
export const useInfo = (defaultData: any) => {
  const [state, dispatch] = useReducer((state, newState) => ({ ...state, ...newState }), {
    data: defaultData,
    loading: false,
  });

  /**
   * 编辑表单数据
   */
  const setData = useCallback((data: any) => dispatch({ data }), []);

  /**
   * 编辑加载状态
   */
  const setLoading: (loading: boolean | string) => void = useCallback((loading = true) => dispatch({ loading }), []);

  return { state, setData, setLoading };
};
