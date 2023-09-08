import { LOCAL_USER_PROFILE } from "@/constants/config";
import { useChangePassword } from "@/pages/auth/auth.loader";
import {
  CACHE_KEYS,
  useUpdateProfile,
  useUpdateUser,
  useUploadAvatar,
} from "@/pages/configuration/user-management/user-management.loader";
import { generateImage } from "@/utils/image";
import { UserOutlined } from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Tabs,
  TabsProps,
  Typography,
  message,
} from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useLocalStorage } from "react-use";

import styles from "./user-profile.module.less";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<boolean>;
}

export const UserProfile: React.FC<Props> = ({ open, setOpen }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useLocalStorage<Record<string, string>>(LOCAL_USER_PROFILE);
  const refInput = useRef<HTMLInputElement>(null);
  const onFinishFailed = () => {
    message.error("Vui lòng nhập dữ liệu!");
  };

  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<any>(null);

  const {
    mutate: mutateChangePassword,
    isLoading: isLoadingChangePassword,
    isError: isErrorChangePassword,
    reset: resetChangePassword,
  } = useChangePassword({
    onSuccess: () => {
      localStorage.clear();
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    },
  });

  const { mutateAsync: mutateUploadAvatar, isLoading: isUpdatingAvatar } = useUploadAvatar({
    onSuccess: (avatar_url) => {
      message.success("Thay đổi avatar thành công");
      setUserProfile({ ...userProfile, avatar_url });
      queryClient.invalidateQueries([CACHE_KEYS.LIST]);
    },
  });

  const { mutateAsync: mutateUpdateProfile, isLoading: isUpdatingProfile } = useUpdateProfile({
    onSuccess: (_, variables) => {
      message.success("Thay đổi thông tin thành công");
      setUserProfile({ ...userProfile, ...variables });
      queryClient.invalidateQueries([CACHE_KEYS.LIST]);
    },
  });

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  const items: TabsProps["items"] = [
    {
      label: "Thông tin cá nhân",
      key: "profile-setting",
      children: (
        <div className={styles.card}>
          <Form
            labelCol={{
              span: 5,
            }}
            onFinish={handleUpdate}
            onFinishFailed={onFinishFailed}
            initialValues={userProfile}
          >
            <Form.Item
              label="Họ và tên"
              name="full_name"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Tên tài khoản"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tên tài khoản" }]}
            >
              <Input />
            </Form.Item>

            <Row>
              <Col push={6} span={18}>
                <Avatar
                  size={128}
                  className={styles.avatar}
                  src={
                    preview ? (
                      preview
                    ) : userProfile?.avatar_url ? (
                      generateImage(userProfile.avatar_url)
                    ) : (
                      <UserOutlined />
                    )
                  }
                  onClick={() => refInput?.current?.click()}
                />
                <input
                  type="file"
                  accept=".bmp, .jpg, .jpeg, .png"
                  ref={refInput}
                  hidden
                  onChange={handleSelectFile}
                />
                <br />
                <br />
                <Typography.Paragraph>
                  Tải ảnh với định dạng BMP, JPG, jPEG, hoặc PNG.
                </Typography.Paragraph>
                <Typography.Paragraph>Kích thước tối đa: 10MB</Typography.Paragraph>
              </Col>
            </Row>
            <div className={styles.buttonSubmit}>
              <Row justify={"end"}>
                <Col className={styles.buttonFooter}>
                  <Button onClick={handleCancel}>Hủy</Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    loading={isUpdatingAvatar || isUpdatingProfile}
                    htmlType="submit"
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
        </div>
      ),
    },
    {
      label: "Đổi mật khẩu",
      key: "security",
      children: (
        <div className={styles.card}>
          <Form
            labelCol={{
              span: 7,
            }}
            labelWrap
            onFinish={handleFinishPassword}
          >
            <Form.Item
              name="password"
              label="Mật khẩu hiện tại"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu hiện tại!",
                },
              ]}
              validateStatus={isErrorChangePassword ? "error" : undefined}
              hasFeedback
              help={isErrorChangePassword ? "Mật khẩu không chính xác" : ""}
            >
              <Input.Password autoComplete="off" />
            </Form.Item>
            <Form.Item
              name="new_password"
              label="Mật khẩu mới"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  message: "Hãy nhập mật khẩu mới",
                  required: true,
                },
                {
                  max: 20,
                  message: "Mật khẩu không được quá 20 ký tự!",
                },
                {
                  min: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự!",
                },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  message: "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu mới không được trùng với mật khẩu cũ!"),
                    );
                  },
                }),
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item
              name="new_confirm_password"
              label="Nhập lại mật khẩu mới"
              dependencies={["new_password"]}
              hasFeedback
              rules={[
                {
                  message: t("auth.enter_confirm_password"),
                  required: true,
                },
                {
                  max: 20,
                  message: "Mật khẩu không được quá 20 ký tự!",
                },
                {
                  min: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("new_password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t("auth.error_confirm_password")));
                  },
                }),
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6 }}>
              <Row justify="end">
                <Col className={styles.buttonFooter}>
                  <Button onClick={handleCancel}>Hủy</Button>
                </Col>
                <Col>
                  <Button type="primary" htmlType="submit" loading={isLoadingChangePassword}>
                    OK
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="Thông tin người dùng"
      open={open}
      onCancel={handleCancel}
      destroyOnClose
      footer={null}
      width={800}
      bodyStyle={{
        padding: 0,
        minHeight: 400,
      }}
      maskClosable={false}
      closeIcon={true}
    >
      <Tabs tabPosition="left" items={items} />
    </Modal>
  );

  function handleCancel() {
    resetChangePassword();
    setOpen(false);
    setPreview(false);
  }

  async function handleUpdate({ full_name, username }: Record<string, string>) {
    await mutateUpdateProfile({
      full_name,
      username,
    });
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      await mutateUploadAvatar(formData);
    }

    // eslint-disable-next-line no-restricted-globals
    setTimeout(() => {
      location.reload();
    }, 500)
  }

  function handleSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  }

  function handleFinishPassword(values: Record<string, string>) {
    mutateChangePassword({
      username: userProfile!.username,
      password: values.password,
      new_password: values.new_password,
    });
  }
};
