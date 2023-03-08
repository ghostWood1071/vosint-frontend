import { LOCAL_USER_PROFILE } from "@/constants/config";
import { useChangePassword } from "@/pages/auth/auth.loader";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "react-use";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<boolean>;
}

export const UserProfile: React.FC<Props> = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const [userProfile] = useLocalStorage<Record<string, string>>(LOCAL_USER_PROFILE);
  const refInput = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<any>(null);

  const { mutate: mutateChangePassword, isLoading: isLoadingChangePassword } = useChangePassword({
    onSuccess: () => {
      localStorage.clear();
      // eslint-disable-next-line no-restricted-globals
      location.reload();
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
      label: "Hồ sơ người dùng",
      key: "profile-setting",
      children: (
        <Card
          bordered={false}
          title="Cấu hình hồ sơ người dùng"
          bodyStyle={{ padding: 0 }}
          style={{ paddingRight: 24, paddingBottom: 24 }}
        >
          <Collapse
            accordion
            expandIconPosition="end"
            expandIcon={() => <EditOutlined />}
            bordered={false}
            ghost
          >
            <Collapse.Panel header="Họ và tên" key="full-name">
              <Form
                labelAlign="right"
                labelCol={{
                  offset: 6,
                }}
              >
                <Form.Item label="Họ">
                  <Input />
                </Form.Item>
                <Form.Item label="Tên">
                  <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6 }}>
                  <Row justify="end">
                    <Col pull={1}>
                      <Button type="primary">Lưu</Button>
                    </Col>
                    <Col>
                      <Button>Huỷ</Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            </Collapse.Panel>
            <Collapse.Panel header="Username" key="username">
              <Form
                labelAlign="right"
                labelCol={{
                  offset: 6,
                }}
              >
                <Form.Item label="Username">
                  <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6 }}>
                  <Row justify="end">
                    <Col pull={1}>
                      <Button type="primary">Lưu</Button>
                    </Col>
                    <Col>
                      <Button>Huỷ</Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            </Collapse.Panel>
            <Collapse.Panel header="Ảnh đại diện" key="profile-picture">
              <Row>
                <Col push={6} span={18}>
                  <Avatar
                    size={128}
                    src={
                      preview ? (
                        preview
                      ) : userProfile?.avatar_url ? (
                        userProfile.avatar_url
                      ) : (
                        <UserOutlined />
                      )
                    }
                    style={{ backgroundColor: "#cccccc" }}
                  />
                  <br />
                  <br />
                  <Typography.Paragraph>
                    Tải ảnh với định dạng BMP, JPG, jPEG, hoặc PNG.
                  </Typography.Paragraph>
                  <Typography.Paragraph>Kích thước tối đa: 100MB</Typography.Paragraph>
                  <Divider />
                  <Space>
                    <Button type="primary" onClick={() => refInput?.current?.click()}>
                      Chọn
                    </Button>
                    <Button type="primary" disabled={!preview}>
                      Lưu
                    </Button>
                    <Button type="text">Huỷ</Button>
                    <input type="file" ref={refInput} hidden onChange={handleSelectFile} />
                  </Space>
                </Col>
              </Row>
            </Collapse.Panel>
          </Collapse>
        </Card>
      ),
    },
    {
      label: "Bảo mật",
      key: "security",
      children: (
        <Card
          bordered={false}
          title="Cấu hình bảo mật"
          bodyStyle={{ padding: 0 }}
          style={{ paddingRight: 24, paddingBottom: 24 }}
        >
          <Collapse
            accordion
            expandIconPosition="end"
            expandIcon={() => <EditOutlined />}
            bordered={false}
            ghost
          >
            <Collapse.Panel header="Mật khẩu" key="full-name">
              <Form
                labelAlign="left"
                labelCol={{
                  offset: 6,
                  flex: "100px",
                }}
                labelWrap
                requiredMark={false}
                onFinish={handleFinishPassword}
              >
                <Form.Item name="password" label="Mật khẩu hiện tại">
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="new_password"
                  label="Mật khẩu mới"
                  rules={[
                    {
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="new_confirm_password"
                  label="Nhập lại mật khẩu mới"
                  dependencies={["new_password"]}
                  hasFeedback
                  rules={[
                    {
                      message: t("auth.enter_confirm_password"),
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
                  <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6 }}>
                  <Row justify="end">
                    <Col pull={1}>
                      <Button type="primary" htmlType="submit" loading={isLoadingChangePassword}>
                        Lưu
                      </Button>
                    </Col>
                    <Col>
                      <Button>Huỷ</Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            </Collapse.Panel>
          </Collapse>
        </Card>
      ),
    },
  ];

  return (
    <Modal
      title="Hồ sơ"
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
    >
      <Tabs tabPosition="left" items={items} />
    </Modal>
  );

  function handleCancel() {
    setOpen(false);
    setPreview(false);
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
      password: values.password,
      new_password: values.new_password,
    });
  }
};
