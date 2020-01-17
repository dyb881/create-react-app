import React, { useRef } from 'react';
import { ConfigProvider, BackTop, Spin } from 'antd';
import { RouterBreadcrumb } from './router_component';
import style from './style.module.less';

export type TPageProps = {
  loading?: boolean | string;
};

export const Page: React.FC<TPageProps> = ({ loading, children }) => {
  const box = useRef(null);

  return (
    <ConfigProvider getPopupContainer={() => box.current || document.body}>
      <div className={`fill overflow ${style.page}`} ref={box}>
        {box.current && <BackTop target={() => box.current!} style={{ right: 50 }} />}
        <RouterBreadcrumb />
        <Spin spinning={!!loading} tip={typeof loading === 'string' ? loading : undefined}>
          {children}
        </Spin>
      </div>
    </ConfigProvider>
  );
};
