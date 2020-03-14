import React, { useEffect } from 'react';
import { Upload as UploadSource } from 'antd';
import { UploadProps, DraggerProps } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined, LoadingOutlined, InboxOutlined } from '@ant-design/icons';
import { useStates } from '../tool';

export type TUploadProps = UploadProps & {
  value?: string | string[];
  max?: number; // 图片上限，默认为 1，也就是单图片上传
};

type TUploadStates = {
  loading: boolean;
  fileList: UploadFile[];
};

/**
 * 文件上传
 */
export const Upload: React.FC<TUploadProps> = ({ value = [], max = 1, onChange, ...props }) => {
  const { states, setStates } = useStates<TUploadStates>({ loading: false, fileList: [] });
  const { loading, fileList } = states;

  useEffect(() => {
    const values = Array.isArray(value) ? value : [value];
    // 转为文件对象列表
    const fileList: any[] = values.map((url, uid) => {
      return { uid, name: '图片', status: 'done', url };
    });
    setStates({ fileList });
  }, []);

  return (
    <UploadSource
      listType="picture-card"
      multiple={max > 1}
      fileList={fileList}
      onChange={info => {
        const { file, fileList } = info;
        setStates({ fileList, loading: file.status === 'uploading' });
        onChange?.(info);
      }}
      {...props}
    >
      {fileList.length < max && (
        <>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div className="ant-upload-text">上传图片</div>
        </>
      )}
    </UploadSource>
  );
};

/**
 * 拖拽上传
 */
export const UploadDragger: React.FC<DraggerProps> = ({ onChange, ...props }) => {
  return (
    <UploadSource.Dragger multiple height={160} listType="picture" {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖文件到这个区域上传</p>
      <p className="ant-upload-hint">支持多个文件或文件夹上传。</p>
    </UploadSource.Dragger>
  );
};
