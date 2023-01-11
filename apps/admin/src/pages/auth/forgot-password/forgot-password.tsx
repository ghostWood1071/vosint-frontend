import React from "react";
import { Input, Form, Button, message } from "antd";
import "antd/dist/antd.css";
import { useNavigate } from "react-router-dom";
import styles from "./forgot-password.module.less";
import { authLoginPath } from "@/pages/router";
import { useTranslation } from "react-i18next";

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onFinish = (values: any) => {
    message.success("Thay đổi mật khẩu thành công!");
    navigate(authLoginPath);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      className={styles.form}
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
      requiredMark={false}
    >
      <Form.Item>
        <div className={styles.containerTitle}>{t("auth.change_password")}</div>
      </Form.Item>
      <Form.Item
        label={t("auth.username")}
        name="username"
        rules={[{ required: true, message: t("auth.username") }]}
      >
        <Input className={styles.textInput} placeholder={t("auth.username")} />
      </Form.Item>

      <Form.Item
        name={"password"}
        label={t("auth.new_password")}
        rules={[
          {
            required: true,
            message: t("auth.new_password"),
          },
        ]}
        hasFeedback
      >
        <Input.Password className={styles.textInput} placeholder={t("auth.new_password")} />
      </Form.Item>

      <Form.Item
        name="confirm"
        label={t("auth.confirm_password")}
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: t("auth.enter_confirm_password"),
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t("auth.error_confirm_password")));
            },
          }),
        ]}
      >
        <Input.Password className={styles.textInput} placeholder={t("auth.confirm_password")} />
      </Form.Item>

      <Form.Item className={styles.forgetPasswordContainer}>
        <Button block={true} type="primary" htmlType="submit" className={styles.loginButton}>
          {t("auth.update")}
        </Button>
      </Form.Item>
    </Form>
  );
};
