import { useSourceNewsConfigList } from "@/pages/configuration/news-config/news-source/news-source.loader";
import { removeWhitespaceInStartAndEndOfString } from "@/utils/tool-validate-string";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  TableColumnsType,
  notification,
} from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./add-group-source.module.less";

interface Props {
  type: string;
  confirmLoading?: boolean;
  isOpen: boolean;
  setIsOpen: (value: any) => void;
  choosedGroupSource: any;
  functionAdd: (value: any) => void;
  functionEdit: (value: any) => void;
  functionDelete: (value: any) => void;
}

const formItemLayoutWithOutLabel = {
  labelCol: { span: 5 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

export const AddGroupModal: React.FC<Props> = ({
  type,
  confirmLoading,
  isOpen,
  setIsOpen,
  choosedGroupSource,
  functionAdd,
  functionDelete,
  functionEdit,
}) => {
  const initialValues = type === "edit" ? { source_name: choosedGroupSource.source_name } : null;
  const [listSource, setListSource] = useState<any[]>(
    type === "edit" ? choosedGroupSource.news : [],
  );
  const [form] = Form.useForm<Record<string, any>>();
  const [api, contextHolder] = notification.useNotification();
  const [value, setValue] = useState<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = useSourceNewsConfigList({
    skip: 1,
    limit: 100,
    text_search: searchParams.get("text") ?? "",
  });

  const openNotification = (placement: any, type: any) => {
    if (type === "exited") {
      api.info({
        message: `Thông báo`,
        description: "Nguồn tin đã được thêm.",
        placement,
      });
    }
  };

  function handleDelete() {
    functionDelete({ _id: choosedGroupSource._id });
    setIsOpen(false);
  }
  function handleCancel() {
    setIsOpen(false);
  }
  async function handleAdd() {
    form
      .validateFields()
      .then((values) => {
        const data = removeWhitespaceInStartAndEndOfString(values);

        functionAdd({ ...data, user_id: "", news: listSource, is_hide: false });
      })
      .catch();
  }

  async function handleEdit() {
    form
      .validateFields()
      .then((values) => {
        const data = removeWhitespaceInStartAndEndOfString(values);
        functionEdit({ ...choosedGroupSource, ...data, news: listSource });
      })
      .catch();
  }

  function handleSearch(value: any) {
    setSearchParams({
      text: value.trim(),
    });
  }

  function handleDeleteItemList(value: any) {
    const result = listSource.filter((e) => e.id !== value.id);
    setListSource(result);
  }

  function addSource() {
    const item = data.data.find((e: any) => e._id === value);
    const check = listSource.findIndex((e) => e.id === item._id);
    if (check === -1) {
      setListSource([...listSource, { id: item._id, name: item.name, host_name: item.host_name }]);
      setValue(null);
    } else {
      openNotification("top", "exited");
    }
  }
  const handleChange = (newValue: object) => {
    setValue(newValue);
  };

  if (type === "delete") {
    return (
      <Modal
        title={"Xoá nhóm nguồn tin"}
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
          <div className={styles.leftDeleteBody}>Tên nhóm nguồn tin:</div>
          <div className={styles.rightDeleteBody}>{choosedGroupSource.source_name}</div>
        </div>
      </Modal>
    );
  }

  const columns: TableColumnsType<any> = [
    {
      title: "Tên nguồn tin",
      align: "left",
      dataIndex: "name",
    },
    {
      title: "Tên miền",
      align: "left",
      dataIndex: "host_name",
    },
    {
      title: "",
      width: 100,
      align: "center",
      render: (item) => {
        return (
          <Space>
            <Col>
              <DeleteOutlined
                title="Xoá nguồn tin"
                onClick={() => handleDeleteItemList(item)}
                className={styles.delete}
              />
            </Col>
          </Space>
        );
      },
    },
  ];

  if (type === "add" || type === "edit") {
    return (
      <Modal
        title={(type === "add" ? "Thêm mới " : "Sửa ") + "nhóm nguồn tin"}
        open={isOpen}
        destroyOnClose
        confirmLoading={confirmLoading}
        onOk={type === "add" ? handleAdd : handleEdit}
        onCancel={handleCancel}
        width={800}
        closable={false}
        maskClosable={false}
      >
        {contextHolder}
        <Form
          initialValues={initialValues ?? {}}
          form={form}
          {...formItemLayoutWithOutLabel}
          preserve={false}
        >
          <Form.Item
            label={"Tên nhóm nguồn tin"}
            name={"source_name"}
            validateTrigger={["onChange", "onBlur"]}
            rules={[
              {
                required: true,
                message: "Hãy nhập vào tên nhóm nguồn tin!",
                whitespace: true,
                pattern: new RegExp("[A-Za-z]{1}"),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={"Danh sách nguồn tin"}>
            <div className={styles.mainContainer}>
              {listSource.length > 0 ? (
                <Table columns={columns} dataSource={listSource} rowKey="id" pagination={false} />
              ) : null}
              <div className={styles.addSourceContainer}>
                <div className={styles.leftContainer}>
                  <Select
                    showSearch
                    value={value}
                    placeholder={"Nhập tên nguồn tin"}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={handleSearch}
                    onChange={handleChange}
                    notFoundContent={null}
                    options={(data?.data || []).map((d: any) => ({
                      value: d._id,
                      label: d.name,
                    }))}
                  />
                </div>
                <div className={styles.rightContainer}>
                  <Button
                    disabled={value ? false : true}
                    type="primary"
                    className={styles.addButton}
                    onClick={addSource}
                  >
                    Thêm
                  </Button>
                </div>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  return null;
};
