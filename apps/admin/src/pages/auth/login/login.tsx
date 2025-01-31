import { LOCAL_ROLE, LOCAL_USER_PROFILE } from "@/constants/config";
import { CACHE_KEYS, useLogin } from "@/pages/auth/auth.loader";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "react-use";

import { authForgotPasswordPath, dashboardPathWithRole } from "../../router";
import styles from "./login.module.less";

type FormLogin = {
  username: string;
  password: string;
  remember: boolean;
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [_, setRole] = useLocalStorage(LOCAL_ROLE);
  const [__, setUserProfile] = useLocalStorage(LOCAL_USER_PROFILE);
  const { mutate } = useLogin({
    onSuccess: ({ detail }: any) => {
      message.success({
        content: "Đăng nhập thành công",
        key: CACHE_KEYS.Login,
      });
      setUserProfile(detail);
      setRole(detail.role);
      navigate(dashboardPathWithRole(detail.role));
    },
    onError: () => {
      message.error({
        content: "Đăng nhập không thành công",
        key: CACHE_KEYS.Login,
      });
    },
  });
  const onFinish = (values: FormLogin) => {
    message.loading({
      content: "Đang tải...",
      key: CACHE_KEYS.Login,
    });
    mutate(values);
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
            <img className={styles.lockIcon} src="/images/lock.png" alt="lock" />
            <span className={styles.titleForgetPassword}>{t("auth.forgot_password")}</span>
          </div>
        </Link>
      </Form.Item>
    </Form>
  );
};
