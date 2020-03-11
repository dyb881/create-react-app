import React, { useState, useCallback } from 'react';
import { Upload, message, Modal } from 'antd';
import { DraggerProps } from 'antd/es/upload';
import { InboxOutlined } from '@ant-design/icons';
import { combine } from 'common';
import { fileToBase64 } from '@dyb881/file';
import { uploadFile } from 'apis';

/**
 * 图片预览组件
 */
export const usePreview = () => {
  const [visible, setVisible] = useState(false);
  const [src, setSrc] = useState('');

  const preview = useCallback(async (file: File | string) => {
    const src = file instanceof File ? await fileToBase64(file) : file;
    setSrc(src);
    setVisible(true);
  }, []);

  const hide = useCallback(() => setVisible(false), []);

  const previewView = (
    <Modal visible={visible} onCancel={hide} footer={null} width={700} zIndex={1001}>
      <img alt="example" style={{ width: '100%' }} src={src} />
    </Modal>
  );

  return {
    preview,
    previewView,
  };
};

/**
 * 拖拽上传
 */
export const UploadDragger = combine<DraggerProps>(({ stores, onChange, ...props }) => {
  const { preview, previewView } = usePreview();
  const { Authorization } = stores.user;

  return (
    <>
      <Upload.Dragger
        multiple
        height={160}
        action={uploadFile.uploadUrl}
        headers={{ Authorization }}
        listType="picture"
        onChange={info => {
          const { status, response } = info.file;
          status === 'error' && message.error(response.message);
          onChange?.(info);
        }}
        onPreview={file => {
          if (file.originFileObj instanceof File) {
            preview(file.originFileObj);
          }
        }}
        onRemove={async file => {
          const { code, data } = file.response;
          if (code === 201) {
            const res = await uploadFile.del([data.id]);
            return res.ok;
          }
        }}
        {...props}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖文件到这个区域上传</p>
        <p className="ant-upload-hint">支持多个文件或文件夹上传。</p>
      </Upload.Dragger>
      {previewView}
    </>
  );
});
