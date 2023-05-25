import { ETreeTag, useNewsSelection } from "@/components/news/news-state";
import { useGetMe } from "@/pages/auth/auth.loader";
import { flatMap, unionBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import { shallow } from "zustand/shallow";

import { NewsTableItem } from "../components/table-news";
import { useNewsFilter } from "../news.context";
import {
  CACHE_KEYS,
  useDeleteNewsInNewsletter,
  useInfiniteNewsList,
  useMutationChangeStatusSeenPost,
  useNewsIdToNewsletter,
} from "../news.loader";
import styles from "./news-list.module.less";

interface Props {}

export const NewsListPage: React.FC<Props> = () => {
  const [skip, setSkip] = useState(1);
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const newsFilter = useNewsFilter();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteNewsList(newsFilter);
  const { data: dataIAm } = useGetMe();
  const { mutate: mutateChangeStatusSeenPost } = useMutationChangeStatusSeenPost();
  const { mutateAsync: mutateDelete } = useDeleteNewsInNewsletter();
  const { mutate: mutateAdd } = useNewsIdToNewsletter();
  const [setNewsSelection] = useNewsSelection((state) => [state.setNewsSelection], shallow);
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

  React.useEffect(() => {
    if (inView && skip * 30 <= data?.pages[0].total_record) {
      setSkip(skip + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS.NewsList]);
    setNewsSelection([]);
    fetchNextPage({ pageParam: { page_number: 1, page_size: 50 } });
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsFilter]);
  useEffect(() => {
    fetchNextPage({ pageParam: { page_number: skip, page_size: 50 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.bodyNews}>
        <table style={{ width: "100%" }}>
          <tbody>
            {dataSource.map((item) => (
              <NewsTableItem
                userId={dataIAm._id}
                key={item._id}
                item={item}
                onDelete={handleDelete}
                onAdd={handleAdd}
                typeTranslate={newsFilter.type_translate}
                lengthDataSource={dataSource?.length}
                setSeen={handleSetSeen}
              />
            ))}
          </tbody>
        </table>
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
      </div>
    </div>
  );

  function handleSetSeen(checkedSeen: boolean, idNews: string) {
    if (checkedSeen) {
      mutateChangeStatusSeenPost({ action: "set-seen", newsId: idNews });
    } else {
      mutateChangeStatusSeenPost({ action: "set-unseen", newsId: idNews });
    }
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
