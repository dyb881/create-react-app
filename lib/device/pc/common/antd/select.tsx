import React from 'react';
import { Select as SelectOld } from 'antd';
import { SelectProps, OptionProps } from 'antd/es/select';
import { toOptions } from '../tool';

const { Option } = SelectOld;

type TOptionProps = OptionProps & {
  label: string | JSX.Element; // 选择的内容
};

type TProps = SelectProps & {
  options: TOptionProps[] | (string | number)[] | object;
  filterKey?: string; // 过滤key
  pageSize?: number; // 一页多少行
  paging?: boolean; // 是否分页
};

type TState = {
  max: number;
  search: string;
};

/**
 * 下拉选择器
 * 追加筛选以及滚动分页，避免一次性同时渲染太多行导致卡顿
 */
export class Select extends React.Component<TProps, TState> {
  pageSize = 0;
  constructor(props: TProps) {
    super(props);
    this.pageSize = props.pageSize || 20;
    this.state = {
      max: this.pageSize,
      search: '',
    };
  }

  scroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { clientHeight, scrollHeight, scrollTop } = e.currentTarget;
    const { max } = this.state;
    if (scrollHeight - clientHeight - 1 < scrollTop && Object.keys(this.props.options).length > max) {
      this.setState({ max: max + this.pageSize });
    }
  };

  search = (search: string) => this.setState({ search });

  filterOption = (item: any) => {
    const value = ('' + item[this.props.filterKey || 'label']).toLowerCase();
    const text = this.state.search.toLowerCase();
    return value.includes(text);
  };

  onDropdownVisibleChange = (open: boolean) => {
    const { onDropdownVisibleChange } = this.props;
    onDropdownVisibleChange && onDropdownVisibleChange(open);
    open || this.setState({ max: this.pageSize });
  };

  render() {
    const { options, filterKey, pageSize, paging, onDropdownVisibleChange, ...props } = this.props;
    const { max, search } = this.state;
    // 转为选项值并过滤
    let list = toOptions(options).filter(this.filterOption);
    // 分页
    if (paging && list.length > max) {
      // 当前选中的值会合并追加到列表，避免无法正常展示选中值
      const selects: any[] = Array.isArray(props.value) ? props.value : [props.value]; // 选中列表
      // 过滤分页或选中值
      list = list.filter((i, k) => k < max || selects.includes(i.value));
    }
    return (
      <SelectOld
        optionLabelProp="title"
        onPopupScroll={this.scroll}
        onSearch={this.search}
        filterOption={() => true}
        placeholder="请选择"
        allowClear
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        {...props}
      >
        {list.map(({ label, title = label, ...i }) => (
          <Option key={search + i.value} title={'' + title} {...i}>
            {label}
          </Option>
        ))}
      </SelectOld>
    );
  }
}

export default Select;
