import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Upload, message, Modal } from 'antd';
import { DraggerProps } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';
import { InboxOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { combine, TInputNotRequired, useStates } from 'common';
import { fileToBase64 } from '@dyb881/file';
import { uploadFile } from 'apis';

export const options = {
  type: { image: '图片', video: '视频', audio: '音频', other: '其他' },
};

/**
 * 图片预览组件
 */
export const usePreview = () => {
  const { states, setStates } = useStates({ visible: false, src: '', type: 'image' });
  const { visible, src, type } = states;

  const preview = useCallback(async (file: File | string, type = 'image') => {
    const src = file instanceof File ? await fileToBase64(file) : file;
    setStates({ src, visible: true, type });
  }, []);

  const hide = useCallback(() => setStates({ visible: false }), []);

  const previewView = (
    <Modal visible={visible} onCancel={hide} footer={null} width={700} zIndex={1001} destroyOnClose>
      {(() => {
        switch (type) {
          case 'image':
            return <img alt="example" style={{ width: '100%' }} src={src} />;
          case 'video':
            return <video style={{ width: '100%' }} src={src} autoPlay controls />;
          case 'audio':
            return <audio style={{ width: '100%' }} src={src} autoPlay controls />;
        }
      })()}
    </Modal>
  );

  return {
    preview,
    previewView,
  };
};

type TUploadProps = {
  children: JSX.Element;
};

/**
 * 上传组件默认 Props 注入
 */
export const UploadProps = combine<TUploadProps>(({ children, stores }) => {
  const { preview, previewView } = usePreview();
  const { Authorization } = stores.user;

  return (
    <>
      {React.cloneElement(children, {
        headers: { Authorization },
        onPreview: (file: UploadFile<any>) => {
          if (file.originFileObj instanceof File) {
            preview(file.originFileObj);
          } else if (file.url) {
            preview(file.url);
          }
        },
      })}
      {previewView}
    </>
  );
});

/**
 * 拖拽上传
 */
export const UploadDragger: React.FC<DraggerProps> = ({ onChange, ...props }) => {
  return (
    <UploadProps>
      <Upload.Dragger
        action={uploadFile.uploadUrl}
        multiple
        height={160}
        listType="picture"
        onChange={info => {
          const { status, response } = info.file;
          status === 'error' && message.error(response.message);
          onChange?.(info);
        }}
        onRemove={async (file: UploadFile<any>) => {
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
    </UploadProps>
  );
};

export type TUploadInput = TInputNotRequired & {
  multiple?: boolean; // 是否可上传多图
  max?: number; // 图片上限
};

/**
 * 文件上传表单组件
 */
export const UploadInput: React.FC<TUploadInput> = ({ value, onChange, multiple, max = 1 }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

  useEffect(() => {
    // 文件路径数组
    let fileList: any = multiple ? value || [] : value ? [value] : [];
    // 转为文件对象列表
    fileList = fileList.map((url: string, uid: number) => ({ uid, name: '图片', status: 'done', url }));
    setFileList(fileList);
  }, []);

  // 上传按钮
  const uploadButton = useMemo(
    () => (
      <>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">上传图片</div>
      </>
    ),
    [loading]
  );

  return (
    <div style={{ minHeight: 118 }}>
      <UploadProps>
        <Upload
          action={uploadFile.uploadUrl + '/image'}
          multiple={multiple}
          listType="picture-card"
          fileList={fileList}
          onChange={({ file, fileList }) => {
            const { status, response } = file;
            status === 'error' && message.error(response.message);
            setFileList(fileList);
            setLoading(status === 'uploading');
            if (status === 'done') {
              const newValue = getFileListUrl(fileList);
              onChange?.(multiple ? newValue : newValue[0]);
            }
          }}
          onRemove={(file: UploadFile<any>) => {
            if (multiple) {
              const newValue = getFileListUrl(fileList);
              const url = getUploadFileUrl(file);
              onChange?.(newValue.filter(i => i !== url));
            } else {
              onChange?.(undefined);
            }
          }}
        >
          {fileList.length >= (multiple ? max : 1) ? null : uploadButton}
        </Upload>
      </UploadProps>
    </div>
  );
};

/**
 * 获取上传对象地址列表
 */
export const getFileListUrl = (fileList: UploadFile<any>[]) => {
  return fileList.map(getUploadFileUrl).filter(Boolean);
};

/**
 * 获取上传对象 URL
 */
export const getUploadFileUrl = (file: UploadFile<any>) => {
  if (file.response) {
    const { code, data } = file.response;
    if (code === 201) return data.url;
  } else if (file.url) {
    return file.url;
  }
};
