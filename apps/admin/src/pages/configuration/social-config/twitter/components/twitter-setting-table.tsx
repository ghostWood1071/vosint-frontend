import {
  CACHE_KEYS,
  useMutationDeleteSocial,
  useMutationUpdateTWSocial,
} from "@/pages/configuration/config.loader";
import styles from "@/pages/configuration/social-config/facebook/components/fb-setting.module.less";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Form, Modal, Space, Table, TableColumnsType, Tag, Tooltip, message } from "antd";
import React, { useState } from "react";
import { useQueryClient } from "react-query";

import { SettingCreateForm } from "./twitter-setting-form";

interface Props {
  searchParams: any;
  setSearchParams: any;
  adminData: any;
  data: any;
  loading: boolean;
}

export const TwSettingTable: React.FC<Props> = ({
  searchParams,
  setSearchParams,
  adminData,
  data,
  loading,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isIdTarget, setIsIdTarget] = useState("");
  const queryClient = useQueryClient();
  const { mutate: mutateUpdate } = useMutationUpdateTWSocial();
  const { mutate: mutateDelete } = useMutationDeleteSocial();
  const [form] = Form.useForm();
  const [isValueTarget, setIsValueTarget] = useState<any>();
  const page = searchParams.get("page");
  const pageSize = searchParams.get("limit");
  const columns: TableColumnsType<any> = [
    {
      title: <p className={styles.namecolumn}>Tên</p>,
      dataIndex: "social_name",
      render: (name: string, data: any) => {
        return (
          <div className={styles.namerow}>
            <Avatar src={data.avatar_url} onClick={handleRouter} className={styles.avatar} />
            <p>{name}</p>
          </div>
        );
        function handleRouter() {
          routerAccount(data);
        }
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
        return list_account?.map((item: any) => (
          <Space size={[0, 8]} wrap>
            <Tag>{item.username}</Tag>
          </Space>
        ));
      },
    },
    {
      title: "",
      align: "center",
      dataIndex: "_id",
      render: (_id: any, values) => {
        return (
          <Space className={styles.spaceStyle}>
            <Tooltip title={"Sửa "}>
              <EditOutlined onClick={handleEdit} className={styles.edit} />
            </Tooltip>
            <Tooltip title={"Xoá "}>
              <DeleteOutlined onClick={handleDelete} className={styles.delete} />
            </Tooltip>
          </Space>
        );
        function handleEdit() {
          handleShowEdit(_id, values);
        }
        function handleDelete() {
          handleShowDelete(_id);
        }
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data?.result}
        rowKey="name"
        pagination={{
          position: ["bottomCenter"],
          total: data?.total_record,
          current: page ? +page : 1,
          onChange: handlePaginationChange,
          pageSize: pageSize ? +pageSize : 10,
          size: "default",
        }}
        loading={loading}
      />
      <Modal
        title="Sửa cấu hình Twitter"
        open={isEditOpen}
        onCancel={handleCancelEdit}
        onOk={handleOkEdit}
        destroyOnClose
      >
        <SettingCreateForm
          setAdminSelect
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
    const values_by_id = values.followed_by
      .map((id: any) => adminData?.result.find((item: any) => item._id === id))
      .filter((item: any) => item !== undefined);
    values.followed_by =
      values_by_id?.map((item: any) => ({
        followed_id: item._id,
        username: item.username,
      })) ?? [];
    mutateUpdate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries(CACHE_KEYS.InfoTWSetting);
        message.success({
          content: "Cập nhật thành công!",
          key: CACHE_KEYS.InfoTWSetting,
        });
      },
      onError: () => {
        message.error({
          content: "Trùng tên !",
          key: CACHE_KEYS.InfoTWSetting,
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
        queryClient.invalidateQueries([CACHE_KEYS.InfoTWSetting]);
        message.success({
          content: "Xoá thành công!",
          key: CACHE_KEYS.InfoTWSetting,
        });
      },
      onError: () => {},
    });
    setIsDeleteOpen(false);
  }
  function routerAccount(data: any) {
    window.open(data.account_link, "_blank");
  }
  function handlePaginationChange(page: number, pageSize: number) {
    searchParams.set("page", page + "");
    searchParams.set("limit", pageSize + "");
    setSearchParams(searchParams);
  }
};
