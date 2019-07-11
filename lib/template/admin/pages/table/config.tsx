import React from 'react';
import { message } from 'antd';
import { FormBoxModal, TextArea, tableTextAreaRender } from 'components';
import { sleep } from 'utils';

// 数据格式
export const createColumns = (table: any) => {
	const res = [
		{
			title: '批次号',
			dataIndex: 'Batch',
			width: 120,
		},
		{
			title: '描述',
			dataIndex: 'Description',
			render: (text: string) => tableTextAreaRender('描述', text),
		},
		{
			title: '操作',
			key: 'action',
			width: 60,
			render: (_text: string, record: any) => {
				return (
					<>
						<FormBoxModal
							title="编辑"
							showButton={<span className="edit pointer">详情</span>}
							onSub={async () => {
								await sleep(500);
								message.success('编辑成功');
								table.getList();
								return true;
							}}
						>
							{ValueItem => (
								<>
									<ValueItem label="批次号" name="Batch" initialValue={record.Batch} fill />
									<ValueItem label="描述" name="Description" initialValue={record.Description} fill>
										<TextArea />
									</ValueItem>
								</>
							)}
						</FormBoxModal>
					</>
				);
			},
		},
	];
	return res;
};
