import { Checkbox, Input, Form, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "react-use";
import {
  authForgotPasswordPath,
  dashboardLeaderPath,
  dashboardExpertPath,
  dashboardAdminPath,
} from "../../router";
import { useTranslation } from "react-i18next";
import styles from "./login.module.less";
import { LOCAL_ROLE } from "@/constants/config";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [_, setValue] = useLocalStorage(LOCAL_ROLE);
  const onFinish = (values: any) => {
    if (values.username === "admin" || values.username === "Admin") {
      setValue("admin");
      navigate(dashboardAdminPath);
    } else if (values.username === "expert" || values.username === "Expert") {
      setValue("expert");
      navigate(dashboardExpertPath);
    } else if (values.username === "leader" || values.username === "Leader") {
      setValue("leader");
      navigate(dashboardLeaderPath);
    } else {
      message.warning("Tài khoản không hợp lệ");
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      className={styles.form}
      name="FormLogin"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="true"
      layout="vertical"
      requiredMark={false}
    >
      <Form.Item>
        <div className={styles.containerTitle}>{t("auth.sign_in_to_vosint")}</div>
      </Form.Item>
      <Form.Item
        label={t("auth.username")}
        name="username"
        rules={[{ required: true, message: t("auth.enter_username") }]}
      >
        <Input className={styles.textInput} placeholder={t("auth.enter_username")} />
      </Form.Item>

      <Form.Item
        label={t("auth.password")}
        name="password"
        rules={[{ required: true, message: t("auth.enter_password") }]}
      >
        <Input.Password className={styles.textInput} placeholder={t("auth.enter_password")} />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>{t("auth.keep_login_again")}</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button block={true} type="primary" htmlType="submit" className={styles.loginButton}>
          {t("auth.login")}
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
        <Link to={authForgotPasswordPath}>
          <div className={styles.forgetPassword}>
            <img className={styles.lockIcon} src="/lock.png" alt="lock" />
            <span className={styles.titleForgetPassword}>{t("auth.forgot_password")}</span>
          </div>
        </Link>
      </Form.Item>
    </Form>
  );
};
