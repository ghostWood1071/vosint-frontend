import { AppContainer } from "@/pages/app";
import { buildTree } from "@/pages/news/news.utils";
import { getNewsDetailUrl } from "@/pages/router";
import { Space } from "antd";
import classNames from "classnames";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

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
  const { newsletterId } = useParams();
  const { mutateAsync, isLoading: isMutateLoading } = useMutationNewsSidebar();
  const navigate = useNavigate();
  const setValues = useTreeStore((state) => state.setValues);

  if (isLoading) return null;

  const gioTinTree = data?.gio_tin && buildTree(data.gio_tin);
  const linhVucTree = data?.linh_vuc && buildTree(data.linh_vuc);
  const chuDeTree = data?.chu_de && buildTree(data.chu_de);

  return (
    <>
      <Space direction="vertical" className={styles.sidebar} size={16}>
        {gioTinTree && (
          <Tree
            title="Giỏ tin"
            treeData={gioTinTree}
            isSpinning={isLoading}
            isEditable
            onClickTitle={handleClickTitle}
            tag={ETreeTag.GIO_TIN}
            selectedKeys={newsletterId ? [newsletterId] : []}
          />
        )}

        {linhVucTree && (
          <Tree
            title="Lĩnh vực tin"
            treeData={linhVucTree}
            isSpinning={isLoading}
            onClickTitle={handleClickTitle}
            tag={ETreeTag.LINH_VUC}
            selectedKeys={newsletterId ? [newsletterId] : []}
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
            selectedKeys={newsletterId ? [newsletterId] : []}
          />
        )}

        <NavLink to={getNewsDetailUrl(ETreeTag.QUAN_TRONG)} className={handleActive}>
          Tin quan trọng
        </NavLink>

        <NavLink to={getNewsDetailUrl(ETreeTag.DANH_DAU)} className={handleActive}>
          Tin được đánh dấu
        </NavLink>
      </Space>
      <NewsForm onFinish={handleFinish} confirmLoading={isMutateLoading} />
    </>
  );

  function handleActive({ isActive }: { isActive: boolean }) {
    return classNames(styles.text, { [styles.active]: isActive });
  }

  function handleFinish(values: Record<string, any>) {
    return mutateAsync(values, {
      onSuccess: () => {
        setValues({
          tag: null,
          action: null,
          data: null,
        });
      },
    });
  }

  function handleClickTitle(newsletterId: string, tag: ETreeTag) {
    navigate(getNewsDetailUrl(newsletterId, tag));
  }
}
