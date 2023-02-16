import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input } from "antd";
import React from "react";

import styles from "./body-add-category.module.less";

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 1 },
  },
};
const formItemLayoutWithOutLabel2 = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 7 },
  },
};

interface Props {
  form: FormInstance<any>;
  onFinish: (values: any) => void;
}

export const BodyAddCategory: React.FC<Props> = ({ form, onFinish }) => {
  return (
    <Form
      name="dynamic_form_item"
      labelCol={{ span: 6 }}
      form={form}
      {...formItemLayoutWithOutLabel}
      onFinish={onFinish}
    >
      <Form.Item
        label="Tên danh mục"
        name={"name_category"}
        rules={[{ message: "Hãy nhập vào tên danh mục!" }]}
      >
        <Input />
      </Form.Item>
      {/* <Form.Item label="Từ khoá bắt buộc" name={"required_value_key"}> */}
      <Form.List
        name="required_value_key"
        rules={[
          {
            validator: async (_, required_value_key) => {
              if (!required_value_key || required_value_key.length < 0) {
                return Promise.reject(new Error("At least 2 passengers"));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(index === 0 ? "" : formItemLayoutWithOutLabel2)}
                label={index === 0 ? "Từ khoá bắt buộc" : ""}
                required={false}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={["onChange", "onBlur"]}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input passenger's name or delete this field.",
                    },
                  ]}
                  noStyle
                >
                  <Input style={{ width: "80%" }} />
                </Form.Item>

                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className={styles.deleteButton}
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item
              {...(fields.length < 1 ? "" : formItemLayoutWithOutLabel2)}
              label={fields.length < 1 ? "Từ khoá bắt buộc" : ""}
            >
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: "80%" }}
                icon={<PlusOutlined />}
              >
                Thêm từ khoá bắt buộc
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      {/* </Form.Item> */}
      <Form.Item label="Từ khoá loại trừ" name={"removed_value_key"}>
        <Input />
      </Form.Item>
    </Form>
  );
};
