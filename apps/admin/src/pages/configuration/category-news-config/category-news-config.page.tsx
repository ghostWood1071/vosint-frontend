import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, List, Modal, Tree } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import React, { useState } from "react";

import styles from "./category-news-config.module.less";
import { BodyAddCategory } from "./components/body-add-category";
import { TableItem } from "./components/table-item";

const treeData: DataNode[] = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        children: [
          { title: "leaf", key: "0-0-0-0" },
          {
            title: "okla",
            key: "0-0-0-1",
          },
          { title: "leaf", key: "0-0-0-2" },
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [{ title: "leaf", key: "0-0-1-0" }],
      },
      {
        title: "parent 1-2",
        key: "0-0-2",
        children: [
          { title: "leaf", key: "0-0-2-0" },
          {
            title: "leaf",
            key: "0-0-2-1",
          },
        ],
      },
    ],
  },
];

export const CategoryNewsConfig = () => {
  const [dataInput, setDataInput] = useState([
    {
      data: treeData,
      infor: {
        required_value_key: ["required value"],
        remove_value_key: "removed value",
      },
    },
  ]);
  const [form] = Form.useForm();
  const [isShowedModal, setIsShowedModal] = useState(false);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>
          <div className={styles.searchButton}>
            <Input.Search placeholder="Tìm kiếm" />
          </div>
        </div>
        <div className={styles.rightHeader}>
          <Button
            onClick={() => setIsShowedModal(true)}
            type="primary"
            className={styles.addButton}
            icon={<PlusOutlined />}
          >
            Thêm
          </Button>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.titleTableContainer}>
          <div className={styles.nameCategory}>Tên danh mục</div>
          <div className={styles.detailCategory}>Mô tả</div>
        </div>
        <div className={styles.detailTable}>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 5,
              size: "default",
              position: "bottom",
            }}
            dataSource={dataInput}
            renderItem={(item) => {
              return <TableItem treeData={item.data} detailData={item.infor} />;
            }}
          />
        </div>
      </div>
      <Modal
        title="Thêm mới danh mục tin tức"
        open={isShowedModal}
        onCancel={handleCancelAdd}
        onOk={handleOkAdd}
        okText={"Cập nhật"}
        cancelText={"Huỷ bỏ"}
        destroyOnClose
      >
        <BodyAddCategory form={form} onFinish={handleFinishCreate} />
        <TenplateCategory />
      </Modal>
    </div>
  );

  function handleCancelAdd() {
    setIsShowedModal(false);
    form.resetFields();
  }

  function handleOkAdd() {
    form.submit();
    setIsShowedModal(false);
  }

  function handleFinishCreate(values: any) {
    console.log(values.name_category);
    const treeData: DataNode[] = [
      {
        title: values.name_category,
        key: new Date().getTime(),
        children: [],
      },
    ];
    setDataInput([
      {
        data: treeData,
        infor: {
          required_value_key: values.required_value_key,
          remove_value_key: values.remove_value_key,
        },
      },
      ...dataInput,
    ]);
    form.resetFields();
  }
};

const templateCategorydata: DataNode[] = [
  {
    title: "Danh sách tin mẫu",
    key: "0-0",
    children: [
      {
        title: "Tin mẫu 1",
        key: "0-0-0",
      },
      {
        title: "Tin mẫu 2",
        key: "0-0-1",
      },
      {
        title: "Tin mẫu 3",
        key: "0-0-2",
      },
    ],
  },
];

const TenplateCategory = () => {
  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };
  return (
    <div className={styles.itemContainer}>
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        // defaultExpandedKeys={["0-0-0"]}
        onSelect={onSelect}
        treeData={templateCategorydata}
      />
    </div>
  );
};
