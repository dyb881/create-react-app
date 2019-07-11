import React from "react";
import { Checkbox as CheckboxOld } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { toOptions } from "./select";

/**
 * 多选框
 */
export const Checkbox: React.SFC<CheckboxGroupProps> = ({
  options,
  ...props
}) => <CheckboxOld.Group options={toOptions(options || [])} {...props} />;

export default Checkbox;
