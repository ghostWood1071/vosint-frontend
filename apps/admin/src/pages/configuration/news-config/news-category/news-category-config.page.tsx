import { NewsletterModal } from "@/components/news/news-modal";
import { ETreeAction, ETreeTag, useNewsState } from "@/components/news/news-state";
import {
  useMutationNewsSidebar,
  useNewsSidebar,
  useNewsletterDetail,
} from "@/pages/news/news.loader";
import { buildTree, getAllChildIds } from "@/pages/news/news.utils";
import { NewsletterDto } from "@/services/news.type";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, List, PageHeader, Row, Typography } from "antd";
import { Descriptions } from "antd";
import { useSearchParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { TableItem } from "./components/table-item";
import styles from "./news-category-config.module.less";

export const CategoryNewsConfig = () => {
  const { action } = useNewsState((state) => state.news);
  const setNews = useNewsState((state) => state.setNews);
  const [searchParams, setSearchParams] = useSearchParams();
  let titleNewsletter = searchParams.get("title_newsletter") ?? "";
  const { data } = useNewsSidebar(titleNewsletter);
  const linhVucTree = data?.linh_vuc && buildTree(data.linh_vuc);
  const { mutateAsync, isLoading: isMutateLoading } = useMutationNewsSidebar();
  const [newsSelectId, setNewsSelectId] = useNewsState(
    (state) => [state.newsSelectId, state.setNewsSelectId],
    shallow,
  );
  const { data: dataDetail } = useNewsletterDetail(newsSelectId as string, {});

  return (
    <>
      <PageHeader
        title="Danh sách lĩnh vực tin"
        extra={[
          <Input.Search
            placeholder="Tìm kiếm"
            defaultValue={titleNewsletter}
            onSearch={(value) => {
              searchParams.set("title_newsletter", value);
              setSearchParams(searchParams);
              setNewsSelectId(null);
            }}
            key="search"
          />,
          <Button onClick={handleClickCreate} type="primary" icon={<PlusOutlined />} key="button">
            Thêm
          </Button>,
        ]}
      >
        <Row>
          <Col span={13} className={styles.col}>
            <div className={styles.nameCategory}>Tên lĩnh vực</div>
            <TableItem values={linhVucTree} />
          </Col>
          <Col span={11} className={styles.col}>
            <div className={styles.nameCategory}>Mô tả</div>
            <Row className={styles.row} align="stretch">
              {dataDetail?.title && (
                <Descriptions.Item label="Tên lĩnh vực" span={3} className={styles.description}>
                  {dataDetail?.title}
                </Descriptions.Item>
              )}
              {(dataDetail?.required_keyword?.length ?? 0) > 0 && (
                <>
                  <Col span={6} className={styles.itemLabel}>
                    Từ khoá bắt buộc
                  </Col>
                  <Col span={18} className={styles.itemContent}>
                    {dataDetail?.required_keyword?.map((i: any) => i + ", ")}
                  </Col>
                </>
              )}
              {dataDetail?.exclusion_keyword && (
                <>
                  <Col span={6} className={styles.itemLabel}>
                    Từ khoá loại trừ
                  </Col>
                  <Col span={18} className={styles.itemContent}>
                    {dataDetail.exclusion_keyword}
                  </Col>
                </>
              )}
            </Row>
            {(dataDetail?.news_samples ?? []).length > 0 && (
              <Card>
                <Typography.Text>Tin mẫu</Typography.Text>
                <List
                  dataSource={dataDetail?.news_samples as any}
                  renderItem={(item: any) => {
                    return (
                      <List.Item>
                        <Typography.Link
                          target="_blank"
                          href={item?.["data:url"] ?? item?.["data_url"]}
                          rel="noreferrer"
                        >
                          {item?.["data:title"] ?? item?.["data_title"]}
                        </Typography.Link>
                      </List.Item>
                    );
                  }}
                />
              </Card>
            )}
          </Col>
        </Row>

        <NewsletterModal onFinish={handleFinish} confirmLoading={isMutateLoading} />
      </PageHeader>
    </>
  );

  function handleClickCreate() {
    setNews({
      tag: ETreeTag.LINH_VUC,
      action: ETreeAction.CREATE,
      data: null,
    });
  }

  function handleFinish(values: NewsletterDto) {
    if (action === ETreeAction.DELETE) {
      const ids = getAllChildIds(data?.linh_vuc, values._id!) ?? [];
      values.newsletter_ids = ids;
    }

    return mutateAsync(values, {
      onSuccess: () => {
        setNews({
          tag: null,
          action: null,
          data: null,
        });
      },
    });
  }
};
