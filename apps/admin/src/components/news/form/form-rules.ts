import type { FormItemProps } from "antd";
import type { ValidatorRule } from "rc-field-form/lib/interface";

export const rulesTitle = (title: string) => {
  return [
    {
      required: true,
      whitespace: true,
      message: `Vui lòng nhập tên ${title}.`,
      pattern: new RegExp("[A-Za-z]{1}"),
    },
  ];
};

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
