import { useParams, useSearchParams } from "react-router-dom";

import { NewsTable } from "../components/news-table";
import { useDeleteNewsInNewsletter, useNewsDetail } from "../news.loader";

export const NewsDetailPage = () => {
  let { newsletterId } = useParams();
  const [searchParams] = useSearchParams();

  const { data, isLoading } = useNewsDetail(newsletterId!, {
    skip: searchParams.get("page_number") ?? 1,
    limit: searchParams.get("page_size") ?? 10,
  });

  const { mutateAsync: mutateDelete, isLoading: isDeleting } = useDeleteNewsInNewsletter(
    newsletterId!,
    {
      skip: searchParams.get("page_number") ?? 1,
      limit: searchParams.get("page_size") ?? 10,
    },
  );

  return (
    <div>
      <NewsTable
        isLoading={isLoading}
        dataSource={data?.result}
        total_record={data?.total_record}
        isDeleting={isDeleting}
        onDelete={handeDelete}
      />
    </div>
  );

  function handeDelete(id: string) {
    return mutateDelete({
      newsId: [id],
      newsletterId: newsletterId!,
    });
  }
};
