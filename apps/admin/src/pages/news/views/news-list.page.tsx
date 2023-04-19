import { ETreeTag, useNewsSelection } from "@/components/news/news-state";
import { useGetMe } from "@/pages/auth/auth.loader";
import { Checkbox, List } from "antd";
import { flatMap, unionBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import { shallow } from "zustand/shallow";

import { NewsItem } from "../components/news-item";
import { useNewsFilter } from "../news.context";
import {
  CACHE_KEYS,
  useDeleteNewsInNewsletter,
  useInfiniteNewsList,
  useNewsIdToNewsletter,
} from "../news.loader";
import styles from "./news-list.module.less";

interface Props {}

export const NewsListPage: React.FC<Props> = () => {
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [skip, setSkip] = useState(1);
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const newsFilter = useNewsFilter();
  const { data, isFetchingNextPage, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteNewsList(newsFilter);
  const { data: dataIAm, isLoading: isLoadingIAm } = useGetMe();
  const { mutateAsync: mutateDelete } = useDeleteNewsInNewsletter();
  const { mutate: mutateAdd } = useNewsIdToNewsletter();
  const [newsSelection, setNewsSelection] = useNewsSelection(
    (state) => [state.newsSelection, state.setNewsSelection],
    shallow,
  );
  const dataSource = unionBy(
    flatMap(
      data?.pages.map((a) =>
        a?.result?.map((e: any) => ({
          ...e,
          isStar: dataIAm?.news_bookmarks.includes(e._id),
          isBell: dataIAm?.vital_list.includes(e._id),
        })),
      ),
    ),
    "_id",
  );
  useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS.NewsList]);
    setSkip(1);
    setNewsSelection([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  React.useEffect(() => {
    if (inView && skip * 30 <= data?.pages[0].total_record) {
      setSkip(skip + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS.NewsList]);
    setNewsSelection([]);
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsFilter]);
  useEffect(() => {
    fetchNextPage({ pageParam: { page_number: skip, page_size: 30 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);
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
        loading={isLoadingIAm}
      />
      <div>
        {skip >= 1 ? (
          <button
            ref={ref}
            disabled={!hasNextPage || isFetchingNextPage}
            style={{ padding: 0, margin: 0, border: 0 }}
          >
            {isFetchingNextPage ? "Đang lấy thêm tin..." : ""}
          </button>
        ) : null}
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Giao diện đang cập nhật..." : null}</div>
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
};
