import {
  CACHE_KEYS,
  useMutationDeleteSocial,
  useMutationUpdateSocial,
} from "@/pages/configuration/config.loader";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Avatar, Form, Modal, Space, Table, TableColumnsType, Tag, Tooltip, message } from "antd";
import React, { useState } from "react";
import { useQueryClient } from "react-query";

import { SettingCreateForm } from "./fb-setting-form";
import styles from "./fb-setting.module.less";

interface Props {
  searchParams: any;
  setSearchParams: any;
  adminData: any;
  data: any;
  loading: boolean;
}

export const SettingTable: React.FC<Props> = ({
  searchParams,
  setSearchParams,
  adminData,
  data,
  loading,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isIdTarget, setIsIdTarget] = useState("");
  const [isValueTarget, setIsValueTarget] = useState<any>();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { mutate: mutateUpdate } = useMutationUpdateSocial();
  const { mutateAsync: mutateDelete } = useMutationDeleteSocial();
  const page = searchParams.get("page_number");
  const pageSize = searchParams.get("page_size");
  const columns: TableColumnsType<any> = [
    {
      title: <div className={styles.namecolumn}>Tên</div>,
      dataIndex: "social_name",
      render: (name: string, data: any) => {
        return (
          <div className={styles.namerow}>
            <Avatar src={data.avatar_url} onClick={handleRouter} className={styles.avatar} />
            <div className={styles.name}>{name}</div>
          </div>
        );

        function handleRouter() {
          routerAccount(data);
        }
      },
    },
    {
      title: "Kiểu tài khoản",
      dataIndex: "social_type",
      render: (id: string) => {
        return <div>{id}</div>;
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
      render: (_id: string, values) => {
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
          handleShowDelete(_id, values);
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
        size="small"
        pagination={{
          position: ["bottomCenter"],
          total: data?.total_record,
          current: page ? +page : 1,
          onChange: handlePaginationChange,
          pageSize: pageSize ? +pageSize : 10,
          size: "default",
          showSizeChanger: true,
        }}
        loading={loading}
      />

      <Modal
        title="Sửa cấu hình Facebook"
        open={isEditOpen}
        onCancel={handleCancelEdit}
        onOk={handleOkEdit}
        destroyOnClose
        maskClosable={false}
      >
        <SettingCreateForm
          setAdminSelect
          adminData={adminData}
          type
          valueTarget={isValueTarget}
          value={"edit"}
          form={form}
          onFinish={handleFinishEdit}
        />
      </Modal>
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

  function handleShowDelete(value: any, values: any) {
    setIsValueTarget(values);
    Modal.confirm({
      title: `Bạn có chắc muốn xoá "${values.social_name}" không?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Xoá",
      cancelText: "Huỷ",
      onOk: () =>
        mutateDelete(value, {
          onSuccess: () => {
            queryClient.invalidateQueries([CACHE_KEYS.InfoFBSetting]);
            message.success({
              content: "Xoá thành công!",
              key: CACHE_KEYS.InfoFBSetting,
            });
          },
          onError: () => {},
        }),
    });
  }

  function routerAccount(data: any) {
    window.open(data.account_link, "_blank");
  }

  function handlePaginationChange(page: number, pageSize: number) {
    searchParams.set("page_number", page + "");
    searchParams.set("page_size", pageSize + "");
    setSearchParams(searchParams);
  }
};
