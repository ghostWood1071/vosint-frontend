import { useGetMe } from "@/pages/auth/auth.loader";
import { useParams, useSearchParams } from "react-router-dom";

import { NewsDetail } from "../components/news-detail";
import { NewsTable } from "../components/news-table";
import {
  useDeleteNewsInNewsletter,
  useNewsByNewsletter,
  useNewsIdToNewsletter,
} from "../news.loader";

export const NewsDetailPage = () => {
  let { newsletterId } = useParams();
  const [searchParams] = useSearchParams();

  const { data, isLoading } = useNewsByNewsletter(newsletterId!, {
    skip: searchParams.get("page_number") ?? 1,
    limit: searchParams.get("page_size") ?? 10,
  });
  const { data: dataIAm, isLoading: isLoadingIAm } = useGetMe();

  const { mutateAsync: mutateDelete } = useDeleteNewsInNewsletter();
  const { mutate: mutateAdd } = useNewsIdToNewsletter();

  const dataSource = data?.result.map((e: any) => ({
    ...e,
    isStar: dataIAm?.news_bookmarks.includes(e._id),
    isBell: dataIAm?.vital_list.includes(e._id),
  }));

  return (
    <div>
      <NewsTable
        isLoading={isLoading && isLoadingIAm}
        dataSource={dataSource}
        total_record={data?.total_record}
        type="edit"
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
      <NewsDetail onDelete={handleDelete} onAdd={handleAdd} />
    </div>
  );

  function handleDelete(newsId: string, tag = newsletterId) {
    return mutateDelete({
      newsId: [newsId],
      newsletterId: tag!,
    });
  }

  function handleAdd(newsId: string, tag = newsletterId) {
    return mutateAdd({
      newsIds: [newsId],
      newsletterId: tag!,
    });
  }
};
