import { Tree } from "@/components";
import { NewsletterModal } from "@/components/news/news-modal";
import { ETreeAction, ETreeTag, useNewsState } from "@/components/news/news-state";
import { AppContainer } from "@/pages/app";
import { buildTree, getAllChildIds } from "@/pages/news/news.utils";
import { getNewsDetailUrl } from "@/pages/router";
import { Space } from "antd";
import classNames from "classnames";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

import { NewsFilterProvider } from "../news.context";
import { useMutationNewsSidebar, useNewsSidebar } from "../news.loader";
import { NewsFilter } from "./news-filter";
import styles from "./news-layout.module.less";

export const NewsLayout: React.FC = () => {
  return (
    <NewsFilterProvider>
      <AppContainer sidebar={<Sidebar />}>
        <NewsFilter />
        <Outlet />
      </AppContainer>
    </NewsFilterProvider>
  );
};

function Sidebar() {
  const { action } = useNewsState((state) => state.news);
  const { data, isLoading } = useNewsSidebar();
  const { newsletterId } = useParams();
  const { mutateAsync, isLoading: isMutateLoading } = useMutationNewsSidebar();
  const navigate = useNavigate();
  const resetNewsState = useNewsState((state) => state.reset);

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
      <NewsletterModal onFinish={handleFinish} confirmLoading={isMutateLoading} />
    </>
  );

  function handleActive({ isActive }: { isActive: boolean }) {
    return classNames(styles.text, { [styles.active]: isActive });
  }

  function handleFinish(values: Record<string, any>) {
    if (action === ETreeAction.DELETE) {
      const ids = getAllChildIds(data?.linh_vuc, values._id!) ?? [];
      values.newsletter_ids = ids;
    }

    return mutateAsync(values, {
      onSuccess: () => resetNewsState(),
    });
  }

  function handleClickTitle(newsletterId: string, tag: ETreeTag) {
    navigate(getNewsDetailUrl(newsletterId, tag));
  }
}
