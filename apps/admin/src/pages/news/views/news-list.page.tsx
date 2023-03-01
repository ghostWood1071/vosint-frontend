import { ETreeTag } from "@/components/tree/tree.store";
import { useGetMe } from "@/pages/auth/auth.loader";
import React from "react";
import { useSearchParams } from "react-router-dom";

import { NewsDetail } from "../components/news-detail";
import { NewsTable } from "../components/news-table";
import { useDeleteNewsInNewsletter, useNewsIdToNewsletter, useNewsList } from "../news.loader";

interface Props {}

export const NewsListPage: React.FC<Props> = () => {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useNewsList({
    order: "modified_at",
    skip: searchParams.get("page_number") ?? 1,
    limit: searchParams.get("page_size") ?? 10,
  });
  const { data: dataIAm, isLoading: isLoadingIAm } = useGetMe();
  const { mutateAsync: mutateDelete } = useDeleteNewsInNewsletter();
  const { mutate: mutateAdd } = useNewsIdToNewsletter();

  const dataSource = data?.result?.map((e: any) => ({
    ...e,
    isStar: dataIAm?.news_bookmarks.includes(e._id),
    isBell: dataIAm?.vital_list.includes(e._id),
  }));

  return (
    <>
      <NewsTable
        isLoading={isLoading && isLoadingIAm}
        dataSource={dataSource}
        total_record={data?.total_record}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
      <NewsDetail onDelete={handleDelete} onAdd={handleAdd} />
    </>
  );

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
