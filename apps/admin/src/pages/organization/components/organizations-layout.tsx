import { Tree } from "@/components";
import { AppContainer } from "@/pages/app";
import { organizationGraphPath } from "@/pages/router";
import { Input, Modal, Space } from "antd";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import { useOrganizationsSidebar } from "../organizations.loader";
import styles from "./organizations-layout.module.less";

export const OrganizationsLayout: React.FC = () => {
  return (
    <AppContainer sidebar={<Sidebar />}>
      <Outlet />
    </AppContainer>
  );
};

function Sidebar() {
  const { t } = useTranslation("translation", { keyPrefix: "news" });
  const { data, isLoading } = useOrganizationsSidebar();
  const navigate = useNavigate();

  if (isLoading) return null;

  return (
    <>
      <Space direction="vertical" className={styles.sidebar}>
        {data.map((basket: { name: string; data: any[] }) => (
          <Tree
            key={basket.name}
            isSpinning={isLoading}
            title={basket.name}
            treeData={basket.data}
            onAdd={basket.name !== "Đồ thị quan hệ quốc tế" ? handleAdd : undefined}
          />
        ))}
        <div className={styles.text} onClick={handleNavigate}>
          Đồ thị quan hệ quốc tế
        </div>
      </Space>
    </>
  );

  function handleNavigate() {
    navigate(organizationGraphPath);
  }

  function handleAdd() {
    Modal.confirm({
      title: t("add_basket"),
      content: <Input placeholder="Tên giỏ tin" />,
      getContainer: "#modal-mount",
      okText: "Thêm",
      cancelText: "Huỷ",
      onOk: function () {},
    });
  }
}
