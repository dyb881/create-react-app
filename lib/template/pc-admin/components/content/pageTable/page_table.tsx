import React from 'react';
import { useHistory } from 'react-router-dom';
import { Divider, Tooltip } from 'antd';
import { PlusOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { RouterPageHeader, TRouterPageHeaderProps } from '../router_component';
import { Page, TPageBoxProps, ButtonMobile } from '../page';
import { Interval } from '../../layout';
import {
  TableMobile,
  TTableMobileProps,
  PaginationMobile,
  TPaginationMobileProps,
  ColumnsSetting,
  useColumnsSetting,
} from './components';

export type TPageTableProps = Pick<TPageBoxProps, 'loading'> &
  Pick<TRouterPageHeaderProps, 'onBack' | 'extra'> &
  Omit<TTableMobileProps, 'loading'> & {
    add?: (() => void) | string; // 新建
    reload?: () => void; // 刷新
    paginationProps?: TPaginationMobileProps; // 分页数据
  };

/**
 * 表格页
 */
export const PageTable: React.FC<TPageTableProps> = ({
  loading,
  onBack,
  extra,
  add,
  reload,
  children,
  paginationProps,
  columns,
  ...props
}) => {
  const { columnsSettingProps, columnsHides } = useColumnsSetting(columns!);
  const { push } = useHistory();

  return (
    <Page loading={loading}>
      <RouterPageHeader
        onBack={onBack}
        extra={
          <>
            {(extra || add) && (
              <>
                <Interval>
                  {extra}
                  {add && (
                    <ButtonMobile
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={typeof add === 'string' ? () => push(add) : add}
                    >
                      新建
                    </ButtonMobile>
                  )}
                </Interval>
                <Divider type="vertical" />
              </>
            )}
            <Interval style={{ marginLeft: 0 }}>
              {reload && (
                <Tooltip placement="top" title="刷新">
                  <ReloadOutlined className="pointer" onClick={reload} />
                </Tooltip>
              )}
              <Tooltip placement="left" title="设置列展示">
                <ColumnsSetting {...columnsSettingProps}>
                  <SettingOutlined className="pointer" />
                </ColumnsSetting>
              </Tooltip>
            </Interval>
          </>
        }
      >
        {children}
      </RouterPageHeader>
      <TableMobile columns={columnsHides} {...props} />
      <PaginationMobile {...paginationProps} />
    </Page>
  );
};
