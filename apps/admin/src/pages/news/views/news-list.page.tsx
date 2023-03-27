import { ETreeTag, useNewsSelection } from "@/components/news/news-state";
import { useGetMe } from "@/pages/auth/auth.loader";
import { Checkbox, List } from "antd";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { NewsItem } from "../components/news-item";
import { useDeleteNewsInNewsletter, useNewsIdToNewsletter, useNewsList } from "../news.loader";
import styles from "./news-list.module.less";

interface Props {}

export const NewsListPage: React.FC<Props> = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const page = searchParams.get("page_number");
  const pageSize = searchParams.get("page_size");
  const skip = searchParams.get("page_number") ?? 1;
  const limit = searchParams.get("page_size") ?? 10;
  const { data, isFetching } = useNewsList(
    {
      order: "modified_at",
      skip: skip ?? 1,
      limit: limit ?? 10,
    },
    {
      keepPreviousData: true,
    },
  );
  const { data: dataIAm, isLoading: isLoadingIAm } = useGetMe();
  const { mutateAsync: mutateDelete } = useDeleteNewsInNewsletter();
  const { mutate: mutateAdd } = useNewsIdToNewsletter();
  const [newsSelection, setNewsSelection] = useNewsSelection(
    (state) => [state.newsSelection, state.setNewsSelection],
    shallow,
  );

  const dataSource = data?.result?.map((e: any) => ({
    ...e,
    isStar: dataIAm?.news_bookmarks.includes(e._id),
    isBell: dataIAm?.vital_list.includes(e._id),
  }));

  useEffect(() => {
    if (newsSelection.length === 0) {
      setCheckAll(false);
      setIndeterminate(false);
    } else if (newsSelection.length === dataSource.length) {
      setCheckAll(true);
      setIndeterminate(false);
    } else {
      setCheckAll(false);
      setIndeterminate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsSelection, dataSource]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleListContainer}>
        <div className={styles.container1}></div>
        <div className={styles.container2}>
          <Checkbox indeterminate={indeterminate} checked={checkAll} onClick={handleCheckAllBox} />
        </div>
        <div className={styles.container3}>Hành động</div>
        <div className={styles.container5}>Tiêu đề</div>
        <div className={styles.container6}>Link</div>
        <div className={styles.container7}>Thời gian</div>
      </div>
      <List
        itemLayout="vertical"
        size="small"
        pagination={{
          position: "bottom",
          onChange: handlePaginationChange,
          current: page ? +page : 1,
          pageSize: pageSize ? +pageSize : 10,
          size: "default",
          total: data?.total_record,
        }}
        dataSource={dataSource}
        renderItem={(item) => {
          return (
            <NewsItem
              item={item}
              onDelete={handleDelete}
              onAdd={handleAdd}
              lengthDataSource={dataSource?.length}
              setIndeterminate={setIndeterminate}
            />
          );
        }}
        loading={isFetching || isLoadingIAm}
      />
      <div className={styles.footer} />
    </div>
  );

  function handleCheckAllBox() {
    if (checkAll) {
      setNewsSelection([]);
    } else {
      setNewsSelection(dataSource);
    }
    setIndeterminate(false);
    setCheckAll(!checkAll);
  }

  function handleDelete(newsId: string, tag?: ETreeTag) {
    return mutateDelete({
      newsId: [newsId],
      newsletterId: tag!,
    });
  }

  function handleAdd(newsId: string, tag: ETreeTag) {
    return mutateAdd({
      newsIds: [newsId],
      newsletterId: tag!,
    });
  }

  function handlePaginationChange(page: number, pageSize: number) {
    searchParams.set("page_number", page + "");
    searchParams.set("page_size", pageSize + "");
    setSearchParams(searchParams);
  }
};
