import {
  CACHE_KEYS,
  useMutationDeleteSocial,
  useMutationUpdateSocial,
} from "@/pages/configuration/config.loader";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Modal, Space, Table, TableColumnsType, Tag, message } from "antd";
import React, { useState } from "react";
import { useQueryClient } from "react-query";

import { SettingCreateForm } from "./fb-setting-form";
import styles from "./fb-setting.module.less";

interface Props {
  adminData: any;
  data: any;
  loading: boolean;
}

export const SettingTable: React.FC<Props> = ({ adminData, data, loading }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isIdTarget, setIsIdTarget] = useState("");
  const [isValueTarget, setIsValueTarget] = useState<any>();
  const queryClient = useQueryClient();
  const [adminSelect, setAdminSelect] = useState([]);
  const [form] = Form.useForm();
  const { mutate: mutateUpdate } = useMutationUpdateSocial();
  const { mutate: mutateDelete } = useMutationDeleteSocial();

  const columns: TableColumnsType<any> = [
    {
      title: <p className={styles.namecolumn}>Tên</p>,
      dataIndex: "social_name",
      render: (name: string, data: any) => {
        return (
          <div className={styles.namerow}>
            <Avatar
              src={data.avatar_url}
              onClick={() => routerAccount(data)}
              className={styles.avatar}
            />
            <p>{name}</p>
          </div>
        );
      },
    },
    {
      title: "Kiểu tài khoản",
      dataIndex: "social_type",
      render: (id: string) => {
        return <p>{id}</p>;
      },
    },
    {
      title: "Các tài khoản theo dõi",
      dataIndex: "followed_by",
      render: (list_account: any) => {
        return list_account?.map((item: any) => (
          <Space size={[0, 8]} wrap>
            <Tag>{item.username}</Tag>
          </Space>
        ));
      },
    },
    {
      title: "",
      align: "right",
      dataIndex: "_id",
      render: (_id: string, values) => {
        return (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => handleShowEdit(_id, values)} />
            <Button icon={<DeleteOutlined />} danger onClick={() => handleShowDelete(_id)} />
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="name"
        pagination={{ position: ["bottomCenter"] }}
        loading={loading}
      />

      <Modal
        title="Sửa cấu hình Facebook"
        open={isEditOpen}
        onCancel={handleCancelEdit}
        onOk={handleOkEdit}
        destroyOnClose
      >
        <SettingCreateForm
          setAdminSelect={setAdminSelect}
          adminData={adminData}
          type
          valueTarget={isValueTarget}
          value={"edit"}
          form={form}
          onFinish={handleFinishEdit}
        />
      </Modal>
      <Modal
        title="Xác nhận xóa tài khoản"
        open={isDeleteOpen}
        onCancel={handleCancelDelete}
        onOk={handleOkDelete}
        destroyOnClose
      ></Modal>
    </>
  );
  function handleShowEdit(value: any, values: any) {
    setIsEditOpen(true);
    setIsValueTarget(values);
    setIsIdTarget(value);
  }

  function handleCancelEdit() {
    setIsEditOpen(false);
    form.resetFields();
  }

  function handleOkEdit() {
    form.submit();
  }

  function handleFinishEdit(values: any) {
    values.id = isIdTarget;
    values.followed_by = adminSelect.map((item: any) => ({
      followed_id: item.value,
      username: item.label,
    }));
    mutateUpdate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries(CACHE_KEYS.InfoFBSetting);
        message.success({
          content: "Cập nhật thành công!",
          key: CACHE_KEYS.InfoFBSetting,
        });
      },
      onError: () => {
        message.error({
          content: "Trùng tên !",
          key: CACHE_KEYS.InfoFBSetting,
        });
      },
    });
    setIsEditOpen(false);
    form.resetFields();
    setIsValueTarget(null);
  }

  function handleShowDelete(value: any) {
    setIsIdTarget(value);
    setIsDeleteOpen(true);
  }

  function handleCancelDelete() {
    setIsDeleteOpen(false);
  }

  function handleOkDelete() {
    mutateDelete(isIdTarget, {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.InfoFBSetting]);
        message.success({
          content: "Xoá thành công!",
          key: CACHE_KEYS.InfoFBSetting,
        });
      },
      onError: () => {},
    });
    setIsDeleteOpen(false);
  }
  function routerAccount(data: any) {
    window.open(data.account_link, "_blank");
  }
};
