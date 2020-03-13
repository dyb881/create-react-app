import React from 'react';
import { Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { VideoCameraOutlined, AudioOutlined, DownloadOutlined } from '@ant-design/icons';
import { Img } from 'components';

const { Text } = Typography;

/**
 * 生成表格配置数据
 */
export const createColumns = ({ del, preview }: any) => {
  const columns: ColumnsType = [
    {
      title: '预览',
      key: 'preview',
      width: 60,
      render: ({ url, type, name }) => {
        switch (type) {
          case 'image':
            return <Img src={url} className="previewImg pointer" onClick={() => preview(url)} />;
          case 'video':
            return (
              <VideoCameraOutlined
                className="previewImg pointer"
                style={{ fontSize: '1.5em' }}
                onClick={() => preview(url, type)}
              />
            );
          case 'audio':
            return (
              <AudioOutlined
                className="previewImg pointer"
                style={{ fontSize: '1.5em' }}
                onClick={() => preview(url, type)}
              />
            );
          case 'other':
            return (
              <a href={url} download={name} target="_blank" rel="noopener noreferrer" className="success">
                <DownloadOutlined className="previewImg pointer" style={{ fontSize: '1.5em' }} />
              </a>
            );
        }
      },
    },
    {
      title: '文件名',
      dataIndex: 'name',
      width: 200,
      render: v => (
        <Text ellipsis copyable>
          {v}
        </Text>
      ),
    },
    {
      title: '文件地址',
      dataIndex: 'url',
      width: 300,
      render: v => (
        <Text ellipsis copyable>
          {v}
        </Text>
      ),
    },
    { title: '文件类型', dataIndex: 'type', width: 90, render: (v?: TTypeKeys) => options.type[v!] },
    { title: '文件大小', dataIndex: 'size', width: 120 },
    { title: '上传帐号', dataIndex: 'username', width: 120 },
    { title: '上传时间', dataIndex: 'create_date', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 60,
      fixed: 'right',
      render: data => (
        <span className="delete pointer" onClick={() => del([data.id])}>
          删除
        </span>
      ),
    },
  ];

  return columns;
};

export const options = {
  type: { image: '图片', video: '视频', audio: '音频', other: '其他' },
};

type TTypeKeys = keyof typeof options.type;
