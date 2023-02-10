import { Tree } from "@/components";
import { AppContainer } from "@/pages/app";
import { Input, Modal, Space } from "antd";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

import { useNewsSidebar } from "../news.loader";
import styles from "./news-layout.module.less";

export const NewsLayout: React.FC = () => {
  return (
    <AppContainer sidebar={<Sidebar />}>
      <Outlet />
    </AppContainer>
  );
};

function Sidebar() {
  const { t } = useTranslation("translation", { keyPrefix: "news" });
  const { data, isLoading } = useNewsSidebar();

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
            onAdd={basket.name === "Giỏ tin" ? handleAdd : undefined}
          />
        ))}
      </Space>
    </>
  );

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
