import type { FormItemProps } from "antd";
import type { ValidatorRule } from "rc-field-form/lib/interface";

export const rulesTitle: FormItemProps["rules"] = [
  {
    required: true,
    whitespace: true,
    message: "Hãy nhập vào tên danh mục!",
    pattern: new RegExp("[A-Za-z]{1}"),
  },
];

export const rulesRequiredListKeyword: ValidatorRule[] = [
  {
    validator: async (_, required_keyword) => {
      if (!required_keyword || required_keyword.length < 0) {
        return Promise.reject(new Error("Cần ít nhất một từ khoá"));
      }
    },
  },
];

export const rulesRequiredItemKeyword: FormItemProps["rules"] = [
  {
    required: true,
    whitespace: true,
    message: "Nhập vào từ khoá.",
    pattern: new RegExp("[A-Za-z]{1}"),
  },
];
