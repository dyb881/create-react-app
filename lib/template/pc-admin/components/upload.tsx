import React, { useEffect, useCallback, useState } from 'react';
import { message } from 'antd';
import { DraggerProps } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';
import { combine, Upload, TUploadProps, UploadDragger as UploadDraggerSource, TInputNotRequired } from 'common';
import { uploadFile } from 'apis';

/**
 * 上传组件默认 Props 注入
 */
export const UploadProps = combine<{ children: JSX.Element }>(({ children, stores }) => {
  const { user, layout } = stores;
  const { Authorization } = user;
  const { preview } = layout;

  const onPreview = useCallback((file: UploadFile) => {
    if (file.originFileObj instanceof File) {
      preview(file.originFileObj, 'image', file.name);
    } else if (file.url) {
      preview(file.url, 'image');
    }
  }, []);

  return React.cloneElement(children, { headers: { Authorization }, onPreview });
});

/**
 * 拖拽上传
 */
export const UploadDragger: React.FC<DraggerProps> = ({ onChange, ...props }) => {
  return (
    <UploadProps>
      <UploadDraggerSource
        action={uploadFile.getUploadUrl()}
        onChange={info => {
          const { status, response } = info.file;
          status === 'error' && message.error(response.message);
          onChange?.(info);
        }}
        onRemove={async (file: UploadFile) => {
          const { code, data } = file.response || {};
          if (code === 201) {
            const res = await uploadFile.del([data.id]);
            return res.ok;
          }
        }}
        {...props}
      />
    </UploadProps>
  );
};

export type TUploadInputProps = Omit<TUploadProps, 'onChange'> & TInputNotRequired;

/**
 * 文件上传表单组件
 */
export const UploadInput: React.FC<TUploadInputProps> = ({ max = 1, value = [], onChange, ...props }) => {
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    const fileListUrl = getFileListUrl(fileList);
    let values = Array.isArray(value) ? value : value ? [value] : [];
    setFileList(
      values.map(url => {
        const index = fileListUrl.indexOf(url);
        return fileList[index] || { uid: url, url, name: '图片', status: 'done' };
      })
    );
  }, [value && value.length]);

  return (
    <div style={{ minHeight: 118 }}>
      <UploadProps>
        <Upload
          max={max}
          fileList={fileList}
          action={uploadFile.getUploadUrl('image')}
          onChange={({ file, fileList }) => {
            if (file.status === 'done') {
              const newValue = getFileListUrl(fileList);
              onChange?.(max > 1 ? newValue : newValue[0]);
            }
            setFileList(fileList);
          }}
          onRemove={(file: UploadFile) => {
            let newValue;
            if (Array.isArray(value)) {
              const url = getUploadFileUrl(file);
              newValue = value.filter(i => i !== url);
            }
            onChange?.(newValue);
          }}
          {...props}
        />
      </UploadProps>
    </div>
  );
};

/**
 * 获取上传对象地址列表
 */
export const getFileListUrl = (fileList: UploadFile[]) => {
  return fileList.map(getUploadFileUrl).filter(Boolean);
};

/**
 * 获取上传对象 URL
 */
export const getUploadFileUrl = (file: UploadFile) => {
  if (file.response) {
    const { code, data } = file.response;
    if (code === 201) return data.url;
  } else if (file.url) {
    return file.url;
  }
};
