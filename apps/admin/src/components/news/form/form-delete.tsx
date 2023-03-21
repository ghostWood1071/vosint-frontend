import { Alert, Typography } from "antd";

import { useNewsState } from "../news-state";

export function NewsletterFormDelete(): JSX.Element {
  const { data } = useNewsState((state) => state.news);

  return (
    <Alert
      description={
        <Typography.Text>
          Bạn có chắc muốn xoá
          <Typography.Text strong> "{data?.title}" </Typography.Text>
          không?
        </Typography.Text>
      }
      type="warning"
      showIcon
    />
  );
}
