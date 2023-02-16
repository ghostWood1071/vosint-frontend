import { useParams, useSearchParams } from "react-router-dom";

import { NewsTable } from "../components/news-table";
import { useNewsDetail } from "../news.loader";

export const NewsDetailPage = () => {
  let { newsletterId } = useParams();
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useNewsDetail(newsletterId ?? "", {
    skip: searchParams.get("page_number") ?? 1,
    limit: searchParams.get("page_size") ?? 10,
  });

  return (
    <div>
      <NewsTable
        isLoading={isLoading}
        dataSource={data?.result}
        total_record={data?.total_record}
      />
    </div>
  );
};
