import { Tree } from "@/components";
import { NewsletterModal } from "@/components/news/news-modal";
import { ETreeAction, ETreeTag, useNewsState } from "@/components/news/news-state";
import { AppContainer } from "@/pages/app";
import { buildTree, getAllChildIds } from "@/pages/news/news.utils";
import { getNewsDetailUrl } from "@/pages/router";
import { useGroupSourceList } from "@/pages/source/source-group/source-group.loader";
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
  const { data: dataSourceGroup } = useGroupSourceList({
    skip: 1,
    limit: 100,
    text_search: "",
  });
  const dataFirst: any[] = [];
  dataSourceGroup?.data?.forEach((e: any) => {
    if (e.is_hide === false) {
      return dataFirst.push(e);
    }
  });
  const dataSourceGroupFinal = dataFirst?.map((e: any) => {
    const dataChildren: any[] = [];
    e.news.forEach((element: any) => {
      dataChildren.push({ key: element.id, _id: element.id, title: element.name, type: "source" });
    });
    return {
      key: e._id,
      _id: e._id,
      title: e.source_name,
      type: "source_group",
      children: dataChildren,
    };
  });

  if (isLoading) return null;

  const gioTinTree = data?.gio_tin && buildTree(data.gio_tin);
  const linhVucTree = data?.linh_vuc && buildTree(data.linh_vuc);
  const chuDeTree = data?.chu_de && buildTree(data.chu_de);
  return (
    <>
      <Space direction="vertical" className={styles.sidebar} size={16}>
        <NavLink to={getNewsDetailUrl(ETreeTag.QUAN_TRONG)} className={handleActive}>
          TIN QUAN TRỌNG
        </NavLink>

        <NavLink to={getNewsDetailUrl(ETreeTag.DANH_DAU)} className={handleActive}>
          TIN ĐƯỢC ĐÁNH DẤU
        </NavLink>
        {gioTinTree && (
          <Tree
            title="GIỎ TIN"
            treeData={gioTinTree}
            isSpinning={isLoading}
            isEditable
            onClickTitle={handleClickTitle}
            tag={ETreeTag.GIO_TIN}
            selectedKeys={newsletterId ? [newsletterId] : []}
          />
        )}

        {dataSourceGroup && (
          <Tree
            title="NHÓM NGUỒN TIN"
            treeData={dataSourceGroupFinal}
            isSpinning={isLoading}
            // isEditable
            onClickTitle={handleClickTitleSource}
            tag={ETreeTag.NGUON_TIN}
            selectedKeys={newsletterId ? [newsletterId] : []}
          />
        )}
        {chuDeTree && (
          <Tree
            title="DANH MỤC CHỦ ĐỀ"
            treeData={chuDeTree}
            isSpinning={isLoading}
            isEditable
            onClickTitle={handleClickTitle}
            tag={ETreeTag.CHU_DE}
            selectedKeys={newsletterId ? [newsletterId] : []}
          />
        )}
        <NavLink to={getNewsDetailUrl(ETreeTag.DANH_DAU)} className={handleActive}>
          TIN TTXVN
        </NavLink>
        {linhVucTree && (
          <Tree
            title="LĨNH VỰC TIN"
            treeData={linhVucTree}
            isSpinning={isLoading}
            onClickTitle={handleClickTitle}
            tag={ETreeTag.LINH_VUC}
            selectedKeys={newsletterId ? [newsletterId] : []}
          />
        )}
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

  function handleClickTitleSource(newsletterId: string, tag: ETreeTag) {
    navigate(getNewsDetailUrl(newsletterId, tag));
  }
}
