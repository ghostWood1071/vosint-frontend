import { useNewsSelection } from "@/components/news/news-state";
import { useGetMe } from "@/pages/auth/auth.loader";
import { Checkbox, List } from "antd";
import { flatMap, unionBy } from "lodash";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { NewsItem } from "../components/news-item";
import { useNewsFilter } from "../news.context";
import {
  CACHE_KEYS,
  useDeleteNewsInNewsletter,
  useInfiniteNewsByNewsletter,
  useNewsIdToNewsletter,
} from "../news.loader";
import styles from "./news-detail.module.less";

export const NewsDetailPage = () => {
  let { newsletterId } = useParams();
  const [newsSelection, setNewsSelection] = useNewsSelection(
    (state) => [state.newsSelection, state.setNewsSelection],
    shallow,
  );
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const [skip, setSkip] = useState(1);
  const newsFilter = useNewsFilter();
  const { data, isFetchingNextPage, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteNewsByNewsletter(newsletterId!, newsFilter);
  const { data: dataIAm } = useGetMe();
  const { mutateAsync: mutateDelete } = useDeleteNewsInNewsletter();
  const { mutate: mutateAdd } = useNewsIdToNewsletter();
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
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
    if (newsSelection.length === 0) {
      setCheckAll(false);
      setIndeterminate(false);
    } else if (newsSelection.length >= dataSource.length) {
      setCheckAll(true);
      setIndeterminate(false);
    } else {
      setCheckAll(false);
      setIndeterminate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsSelection, dataSource]);

  useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS.NewsList, newsletterId]);
    setNewsSelection([]);
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsletterId, newsFilter]);

  useEffect(() => {
    if (inView && skip * 30 < data?.pages[data?.pages.length - 1].total_record) {
      setSkip(skip + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    fetchNextPage({ pageParam: { skip: skip, limit: 30 } });
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
        <div className={styles.container8}></div>
      </div>
      <List
        itemLayout="vertical"
        size="small"
        dataSource={dataSource}
        renderItem={(item) => {
          return (
            <NewsItem
              item={item}
              type="edit"
              onDelete={handleDelete}
              onAdd={handleAdd}
              lengthDataSource={dataSource?.length}
              setIndeterminate={setIndeterminate}
            />
          );
        }}
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

  function handleDelete(newsId: string, tag = newsletterId) {
    return mutateDelete(
      {
        newsId: [newsId],
        newsletterId: tag!,
      },
      {
        onSuccess: (data, variables) => {
          setNewsSelection([...newsSelection].filter((e) => e._id !== variables.newsId[0]));
        },
      },
    );
  }

  function handleAdd(newsId: string, tag = newsletterId) {
    return mutateAdd({
      newsIds: [newsId],
      newsletterId: tag!,
    });
  }
};
