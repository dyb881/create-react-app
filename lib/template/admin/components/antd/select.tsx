import React from 'react';
import { Select as SelectOld } from 'antd';
import { SelectProps, OptionProps } from 'antd/es/select';

interface IOptionProps extends OptionProps {
  label: string | JSX.Element; // 选择的内容
}

interface ISelectProps extends SelectProps {
  options: IOptionProps[] | (string | number)[] | object;
  filterKey?: string; // 过滤key
  pageSize?: number; // 一页多少行
  paging?: boolean; // 是否分页
}

interface ISelectState {
  max: number;
  search: string;
}

const { Option } = SelectOld;

/**
 * 转为选项值
 */
export const toOptions = (options: any[] | any) =>
  Object.keys(options).map((k: any) =>
    typeof options[k] === 'object' ? options[k] : { label: options[k], value: +k || +k === 0 ? +k : k }
  );

/**
 * 选择器
 */
export class Select extends React.Component<ISelectProps, ISelectState> {
  pageSize = 0;
  constructor(props: ISelectProps) {
    super(props);
    this.pageSize = props.pageSize || 20;
    this.state = {
      max: this.pageSize,
      search: '',
    };
  }

  scroll = (e: any) => {
    const { clientHeight, scrollHeight, scrollTop } = e.target;
    const { max } = this.state;
    if (scrollHeight - clientHeight - 1 < scrollTop && Object.keys(this.props.options).length > max) {
      this.setState({ max: max + this.pageSize });
    }
  };

  search = (search: string) => this.setState({ search });

  filterOption = (item: any) => {
    const value = ('' + item[this.props.filterKey || 'label']).toLowerCase();
    const text = this.state.search.toLowerCase();
    return value.indexOf(text) > -1;
  };

  onDropdownVisibleChange = (open: boolean) => {
    const { onDropdownVisibleChange } = this.props;
    onDropdownVisibleChange && onDropdownVisibleChange(open);
    open || this.setState({ max: this.pageSize });
  };

  render() {
    const { options, filterKey, pageSize, paging, onDropdownVisibleChange, ...props } = this.props;
    const { max, search } = this.state;
    let list = toOptions(options).filter(this.filterOption);
    if (paging && list.length > max) {
      const selects: any[] = Array.isArray(props.value) ? props.value : [props.value]; // 选中列表
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
