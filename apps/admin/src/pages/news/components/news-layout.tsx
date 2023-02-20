import { AppContainer } from "@/pages/app";
import { buildTree } from "@/pages/news/news.utils";
import { getNewsDetailUrl } from "@/pages/router";
import { Space } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

import { Tree } from "../../../components/tree";
import { ETreeTag, useTreeStore } from "../../../components/tree/tree.store";
import { useMutationNewsSidebar, useNewsSidebar } from "../news.loader";
import { NewsForm } from "./news-form";
import styles from "./news-layout.module.less";

export const NewsLayout: React.FC = () => {
  return (
    <AppContainer sidebar={<Sidebar />}>
      <Outlet />
    </AppContainer>
  );
};

function Sidebar() {
  const { data, isLoading } = useNewsSidebar();
  const { mutate, isLoading: isMutateLoading } = useMutationNewsSidebar();
  const navigate = useNavigate();
  const setValues = useTreeStore((state) => state.setValues);

  if (isLoading) return null;

  const gioTinTree = data?.gio_tin && buildTree(data.gio_tin);
  const linhVucTree = data?.linh_vuc && buildTree(data.linh_vuc);
  const chuDeTree = data?.chu_de && buildTree(data.chu_de);

  return (
    <>
      <Space direction="vertical" className={styles.sidebar}>
        {gioTinTree && (
          <Tree
            title="Giỏ tin"
            treeData={gioTinTree}
            isSpinning={isLoading}
            isEditable
            onClickTitle={handleClickTitle}
            tag={ETreeTag.GIO_TIN}
          />
        )}

        {linhVucTree && (
          <Tree
            title="Lĩnh vực tin"
            treeData={linhVucTree}
            isSpinning={isLoading}
            onClickTitle={handleClickTitle}
            tag={ETreeTag.LINH_VUC}
          />
        )}

        {chuDeTree && (
          <Tree
            title="Danh mục chủ đề"
            treeData={chuDeTree}
            isSpinning={isLoading}
            isEditable
            onClickTitle={handleClickTitle}
            tag={ETreeTag.CHU_DE}
          />
        )}
      </Space>
      <NewsForm onFinish={handleFinish} confirmLoading={isMutateLoading} />
    </>
  );

  function handleFinish(values: Record<string, any>) {
    mutate(values, {
      onSuccess: () => {
        setValues({
          tag: null,
          action: null,
          data: null,
        });
      },
    });
  }

  function handleClickTitle(newsletterId: string) {
    navigate(getNewsDetailUrl(newsletterId));
  }
}
