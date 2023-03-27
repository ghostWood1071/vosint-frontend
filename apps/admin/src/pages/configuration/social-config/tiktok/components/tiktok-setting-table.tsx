import {
  CACHE_KEYS,
  useMutationDeleteSocial,
  useMutationUpdateTWSocial,
} from "@/pages/configuration/config.loader";
import styles from "@/pages/configuration/social-config/facebook/components/fb-setting.module.less";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Modal, Space, Table, TableColumnsType, Tag, message } from "antd";
import React, { useState } from "react";
import { useQueryClient } from "react-query";

import { SettingCreateForm } from "./tiktok-setting-form";

interface Props {
  adminData: any;
  data: any;
  loading: boolean;
}

export const TTSettingTable: React.FC<Props> = ({ adminData, data, loading }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isIdTarget, setIsIdTarget] = useState("");
  const queryClient = useQueryClient();
  const { mutate: mutateUpdate } = useMutationUpdateTWSocial();
  const { mutate: mutateDelete } = useMutationDeleteSocial();
  const [form] = Form.useForm();
  const [isValueTarget, setIsValueTarget] = useState<any>();
  const [adminSelect, setAdminSelect] = useState([]);
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
      title: "ID",
      dataIndex: "_id",
      render: (id: string) => {
        return <p>{id}</p>;
      },
    },
    {
      title: "Các tài khoản theo dõi",
      dataIndex: "followed_by",
      render: (list_account: any) => {
        return list_account.map((item: any) => (
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
      render: (_id: any, values: any) => {
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
        title="Sửa cấu hình Tiktok"
        open={isEditOpen}
        onCancel={handleCancelEdit}
        onOk={handleOkEdit}
        destroyOnClose
      >
        <SettingCreateForm
          setAdminSelect={setAdminSelect}
          adminData={adminData}
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

  function handleFinishEdit(values: any) {
    values.id = isIdTarget;
    values.social_type = "Object";
    values.followed_by = adminSelect.map((item: any) => ({
      followed_id: item.value,
      username: item.label,
    }));
    mutateUpdate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries(CACHE_KEYS.InfoTTSetting);
        message.success({
          content: "Cập nhật thành công!",
          key: CACHE_KEYS.InfoTTSetting,
        });
      },
      onError: () => {
        message.error({
          content: "Trùng tên !",
          key: CACHE_KEYS.InfoTTSetting,
        });
      },
    });
    setIsEditOpen(false);
  }

  function handleShowEdit(value: any, values: any) {
    setIsIdTarget(value);
    setIsValueTarget(values);
    setIsEditOpen(true);
  }

  function handleCancelEdit() {
    setIsEditOpen(false);
    form.resetFields();
  }

  function handleOkEdit() {
    form.submit();
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
        queryClient.invalidateQueries([CACHE_KEYS.InfoTTSetting]);
        message.success({
          content: "Xoá thành công!",
          key: CACHE_KEYS.InfoTTSetting,
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
