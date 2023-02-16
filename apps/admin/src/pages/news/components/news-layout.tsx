import { AppContainer } from "@/pages/app";
import { useNewsletterStore } from "@/pages/news/news.store";
import { buildTree } from "@/pages/news/news.utils";
import { getNewsDetailUrl } from "@/pages/router";
import { Form, Input, Modal, Space } from "antd";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";

import { useMutationNewsSidebar, useNewsSidebar } from "../news.loader";
import styles from "./news-layout.module.less";
import { Tree } from "./tree";

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
  const { mutate, isLoading: isMutateLoading } = useMutationNewsSidebar();
  const [form] = Form.useForm();
  const { newsletter, open, setOpen } = useNewsletterStore((state) => ({
    newsletter: state.newsletter,
    open: state.open,
    setOpen: state.setOpen,
  }));
  const navigate = useNavigate();

  if (isLoading) return null;

  const buildNewslettersTree = data?.newsletters && buildTree(data.newsletters);
  const buildFieldsTree = data?.fields && buildTree(data.fields);
  const buildTopicsTree = data?.topics && buildTree(data.topics);

  return (
    <>
      <Space direction="vertical" className={styles.sidebar}>
        {buildNewslettersTree && (
          <Tree
            title="Giỏ tin"
            treeData={buildNewslettersTree}
            isSpinning={isLoading}
            isEditable
            type="newsletter"
            onClick={handleSelect}
          />
        )}

        {buildFieldsTree && (
          <Tree
            title="Lĩnh vực tin"
            treeData={buildFieldsTree}
            isSpinning={isLoading}
            type="field"
            onClick={handleSelect}
          />
        )}

        {buildTopicsTree && (
          <Tree
            title="Danh mục chủ đề"
            treeData={buildTopicsTree}
            isSpinning={isLoading}
            type="topic"
            isEditable
            onClick={handleSelect}
          />
        )}
      </Space>
      <Modal
        title={t(open ?? "")}
        open={!!open}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isMutateLoading}
        destroyOnClose
      >
        <Form initialValues={newsletter} form={form} preserve={false}>
          <Form.Item name="title">
            <Input placeholder="Tên giỏ tin" disabled={open === "delete"} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  function handleOk() {
    const title: string = form.getFieldValue("title");
    mutate(
      {
        ...newsletter,
        title,
        mode: open,
      },
      {
        onSuccess: () => {
          setOpen(null);
        },
      },
    );
  }

  function handleCancel() {
    setOpen(null);
  }

  function handleSelect(newsletterId: string) {
    navigate(getNewsDetailUrl(newsletterId));
  }
}
