import { BASE_URL } from "@/constants/config";
import { uploadFile } from "@/services/cate-config.service";
import { Form, Input, Modal, Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import React, { useState } from "react";

import styles from "./add-cate.module.less";

interface Props {
  type: string;
  confirmLoading?: boolean;
  isOpen: boolean;
  setIsOpen: (value: any) => void;
  nameTitle: string;
  choosedCate: any;
  functionAdd: (value: any) => void;
  functionEdit: (value: any) => void;
  functionDelete: (value: any) => void;
  setChoosedCate: (value: any) => void;
  typeObject: string;
}

const formItemLayoutWithOutLabel = {
  labelCol: { span: 4 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

export const AddCateComponent: React.FC<Props> = ({
  type,
  confirmLoading,
  isOpen,
  setIsOpen,
  nameTitle,
  choosedCate,
  functionAdd,
  functionDelete,
  functionEdit,
  setChoosedCate,
  typeObject,
}) => {
  const [fileList, setFileList] = useState<any[]>(
    type === "edit"
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: choosedCate.avatar_url,
          },
        ]
      : [],
  );

  const onChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onRemove: UploadProps["onRemove"] = async () => {
    setFileList([]);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const [conditionValue, setConditionValue] = useState("vi");
  const initialValues =
    type === "edit"
      ? choosedCate
      : { facebook_link: "", twitter_link: "", profile: "", profile_link: "" };
  console.log(choosedCate);
  const [key, setKey] = useState<Record<string, string>>({
    vi: type === "edit" ? choosedCate.keywords.vi : "",
    en: type === "edit" ? choosedCate.keywords.en : "",
    cn: type === "edit" ? choosedCate.keywords.cn : "",
    ru: type === "edit" ? choosedCate.keywords.ru : "",
  });
  const [form] = Form.useForm<Record<string, any>>();

  function handleDelete() {
    functionDelete({ _id: choosedCate._id });
    setIsOpen(false);
    setChoosedCate(null);
  }
  function handleCancel() {
    setIsOpen(false);
  }
  async function handleAdd() {
    form
      .validateFields()
      .then(async (values) => {
        var url = "";
        if (fileList[0] !== undefined) {
          var newFile: any = fileList[0].originFileObj;
          delete newFile["uid"];
          const formDataa: any = new FormData();
          formDataa.append("file", newFile);

          const result = await uploadFile(formDataa);
          url = BASE_URL + "/v2/" + result.data[0].file_url;
        }
        const result = {
          ...values,
          keywords: key,
          avatar_url: url,
          status: "enable",
          type: typeObject,
        };
        functionAdd(result);
        setIsOpen(false);
      })
      .catch();
  }

  async function handleEdit() {
    form
      .validateFields()
      .then(async (values) => {
        var url = "";
        if (fileList[0]?.url === undefined) {
          var newFile: any = fileList[0].originFileObj;
          delete newFile["uid"];
          const formDataa: any = new FormData();
          formDataa.append("file", newFile);

          const result = await uploadFile(formDataa);
          url = BASE_URL + "/v2/" + result.data[0].file_url;
        } else {
          url = choosedCate.avatar_url;
        }
        const result = { ...initialValues, ...values, keywords: key, avatar_url: url };
        functionEdit(result);

        setChoosedCate(result);
        setIsOpen(false);
      })
      .catch();
  }

  if (type === "delete") {
    return (
      <Modal
        title={"Xoá " + nameTitle}
        open={isOpen}
        destroyOnClose
        confirmLoading={confirmLoading}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText={"Xoá"}
        closable={false}
        maskClosable={false}
      >
        <div className={styles.deleteBodyContainer}>
          <div className={styles.leftDeleteBody}>Tên {nameTitle}:</div>
          <div className={styles.rightDeleteBody}>{choosedCate.name}</div>
        </div>
      </Modal>
    );
  }
  if (type === "add" || type === "edit") {
    return (
      <Modal
        title={(type === "add" ? "Thêm mới " : "Sửa ") + nameTitle}
        open={isOpen}
        destroyOnClose
        confirmLoading={confirmLoading}
        onOk={type === "add" ? handleAdd : handleEdit}
        onCancel={handleCancel}
        width={800}
        closable={false}
        maskClosable={false}
      >
        <Form
          initialValues={initialValues ?? {}}
          form={form}
          {...formItemLayoutWithOutLabel}
          preserve={false}
        >
          <Form.Item
            label={"Tên " + nameTitle}
            name={"name"}
            validateTrigger={["onChange", "onBlur"]}
            rules={[
              {
                required: true,
                message: "Hãy nhập vào tên " + nameTitle + "!",
                whitespace: true,
                pattern: new RegExp("[A-Za-z]{1}"),
              },
            ]}
          >
            <Input defaultValue={type === "edit" ? choosedCate.name : ""} />
          </Form.Item>
          <Form.Item
            validateTrigger={["onChange", "onBlur"]}
            label="Link Facebook"
            name={"facebook_link"}
          >
            <Input defaultValue={type === "edit" ? choosedCate.facebook_link : ""} />
          </Form.Item>
          <Form.Item
            validateTrigger={["onChange", "onBlur"]}
            label="Link Twitter"
            name={"twitter_link"}
          >
            <Input defaultValue={type === "edit" ? choosedCate.twitter_link : ""} />
          </Form.Item>
          <Form.Item
            validateTrigger={["onChange", "onBlur"]}
            label="Link Profile"
            name={"profile_link"}
          >
            <Input defaultValue={type === "edit" ? choosedCate.profile_link : ""} />
          </Form.Item>

          <Form.Item validateTrigger={["onChange", "onBlur"]} label="Profile" name={"profile"}>
            <Input defaultValue={type === "edit" ? choosedCate.profile : ""} />
          </Form.Item>
          <Form.Item label={"Upload avatar"}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              onRemove={onRemove}
              accept={"image/*"}
            >
              {fileList.length < 1 && "+ Upload"}
            </Upload>
          </Form.Item>

          {/* <input type="file" onChange={onChange} /> */}
          <div className={styles.conditionContainer}>
            <div className={styles.titleConditionContainer}>Điều kiện:</div>
            <div className={styles.allOptionContainer}>
              <div className={styles.allItemCondition}>
                <div className={styles.conditionOptionContainer}>
                  <div
                    className={
                      conditionValue === "vi"
                        ? styles.conditionOptionType1
                        : styles.conditionOptionType2
                    }
                    onClick={() => {
                      setConditionValue("vi");
                    }}
                  >
                    Tiếng Việt
                  </div>
                </div>
                <div className={styles.conditionOptionContainer}>
                  <div
                    className={
                      conditionValue === "en"
                        ? styles.conditionOptionType1
                        : styles.conditionOptionType2
                    }
                    onClick={() => {
                      setConditionValue("en");
                    }}
                  >
                    Tiếng Anh
                  </div>
                </div>
                <div className={styles.conditionOptionContainer}>
                  <div
                    className={
                      conditionValue === "cn"
                        ? styles.conditionOptionType1
                        : styles.conditionOptionType2
                    }
                    onClick={() => {
                      setConditionValue("cn");
                    }}
                  >
                    Tiếng Trung
                  </div>
                </div>
                <div className={styles.conditionOptionContainer}>
                  <div
                    className={
                      conditionValue === "ru"
                        ? styles.conditionOptionType1
                        : styles.conditionOptionType2
                    }
                    onClick={() => {
                      setConditionValue("ru");
                    }}
                  >
                    Tiếng Nga
                  </div>
                </div>
              </div>
              <div className={styles.detailOptionItemContainer}>
                <Input
                  onChange={(event) => {
                    setKey({ ...key, [conditionValue]: event.target.value });
                  }}
                  value={key[conditionValue]}
                />
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }

  return null;
};
