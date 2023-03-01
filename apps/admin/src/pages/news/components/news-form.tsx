import { ETreeAction, ETreeTag, useTreeStore } from "@/components/tree/tree.store";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import shallow from "zustand/shallow";

import styles from "./news-form.module.less";

const formItemLayoutWithOutLabel = {
  labelCol: { span: 6 },
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
  onFinish: (values: Record<string, any>) => void;
  confirmLoading?: boolean;
}

export const NewsForm: React.FC<Props> = ({ onFinish, confirmLoading }) => {
  const { t } = useTranslation("translation", { keyPrefix: "news" });
  const [form] = Form.useForm<Record<string, any>>();
  const [tag, action, initialValues] = useTreeStore(
    (state) => [state.tag, state.action, state.data],
    shallow,
  );
  const setValues = useTreeStore((state) => state.setValues);

  if (action === ETreeAction.SELECT) {
    return null;
  }

  return (
    <Modal
      title={t(action!) + t(tag!)}
      open={action !== null}
      confirmLoading={confirmLoading}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      destroyOnClose
      getContainer="#modal-mount"
    >
      {tag === ETreeTag.GIO_TIN && (
        <Form form={form} initialValues={initialValues ?? {}} preserve={false}>
          <Form.Item name="title">
            <Input placeholder="Nhập tên giỏ tin" disabled={action === ETreeAction.DELETE} />
          </Form.Item>
        </Form>
      )}

      {(tag === ETreeTag.CHU_DE || tag === ETreeTag.LINH_VUC) && (
        <Form
          form={form}
          initialValues={initialValues ?? {}}
          {...formItemLayoutWithOutLabel}
          preserve={false}
        >
          <Form.Item
            label="Tên danh mục"
            name={"title"}
            validateTrigger={["onChange", "onBlur"]}
            rules={[{ required: true, message: "Hãy nhập vào tên danh mục!", whitespace: true }]}
          >
            <Input placeholder="Nhập tên danh mục" disabled={action === ETreeAction.DELETE} />
          </Form.Item>
          <Form.List
            name="required_keyword"
            rules={[
              {
                validator: async (_, required_keyword) => {
                  if (!required_keyword || required_keyword.length < 0) {
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
                          message: "Nhập vào từ khoá.",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder="Các từ phân tách nhau bởi dấu phẩy"
                        disabled={action === ETreeAction.DELETE}
                        style={{ width: "80%" }}
                      />
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
                    disabled={action === ETreeAction.DELETE}
                  >
                    Thêm từ khoá bắt buộc
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item label="Từ khoá loại trừ" name={"exclusion_keyword"}>
            <Input
              placeholder="Các từ phân tách nhau bởi dấu phẩy"
              disabled={action === ETreeAction.DELETE}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );

  function handleOk() {
    const values = form.getFieldsValue();

    onFinish({
      ...initialValues,
      ...values,
      tag,
      action,
    });
  }

  function handleCancel() {
    form.resetFields();
    setValues({
      tag: null,
      action: null,
      data: null,
    });
  }
};
