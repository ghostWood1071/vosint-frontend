import { NewsletterModal } from "@/components/news/news-modal";
import { ETreeAction, ETreeTag, useNewsState } from "@/components/news/news-state";
import { NewsletterDTO } from "@/models/newsletter.type";
import {
  useMutationNewsSidebar,
  useNewsSidebar,
  useNewsletterDetail,
} from "@/pages/news/news.loader";
import { buildTree, getAllChildIds } from "@/pages/news/news.utils";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, List, PageHeader, Row, Typography } from "antd";
import { Descriptions } from "antd";
import { useState } from "react";
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
  const [conditionValue, setConditionValue] = useState("keyword_vi");

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
                <>
                  <Col span={6} className={styles.itemLabel} style={{paddingRight: "20px"}}>
                    Tên lĩnh vực
                  </Col>
                  <Col span={18} className={styles.itemContent}>
                    {dataDetail?.title}
                  </Col>
                </>
              )}
              {dataDetail?.title && (
                <Col span={24}>
                  <div className={styles.allItemCondition}>
                    <div className={styles.conditionOptionContainer}>
                      <div
                        className={
                          conditionValue === "keyword_vi"
                            ? styles.conditionOptionType1
                            : styles.conditionOptionType2
                        }
                        onClick={() => {
                          setConditionValue("keyword_vi");
                        }}
                      >
                        Tiếng Việt
                      </div>
                    </div>
                    <div className={styles.conditionOptionContainer}>
                      <div
                        className={
                          conditionValue === "keyword_en"
                            ? styles.conditionOptionType1
                            : styles.conditionOptionType2
                        }
                        onClick={() => {
                          setConditionValue("keyword_en");
                        }}
                      >
                        Tiếng Anh
                      </div>
                    </div>
                    <div className={styles.conditionOptionContainer}>
                      <div
                        className={
                          conditionValue === "keyword_cn"
                            ? styles.conditionOptionType1
                            : styles.conditionOptionType2
                        }
                        onClick={() => {
                          setConditionValue("keyword_cn");
                        }}
                      >
                        Tiếng Trung
                      </div>
                    </div>
                    <div className={styles.conditionOptionContainer}>
                      <div
                        className={
                          conditionValue === "keyword_ru"
                            ? styles.conditionOptionType1
                            : styles.conditionOptionType2
                        }
                        onClick={() => {
                          setConditionValue("keyword_ru");
                        }}
                      >
                        Tiếng Nga
                      </div>
                    </div>
                  </div>
                </Col>
              )}
              {(dataDetail?.[conditionValue]?.required_keyword?.length ?? 0) > 0 && (
                <>
                  <Col span={6} className={styles.itemLabel}>
                    Từ khoá bắt buộc
                  </Col>
                  <Col span={18} className={styles.itemContent}>
                    {dataDetail?.[conditionValue]?.required_keyword?.map((i: any) => i + ", ")}
                  </Col>
                </>
              )}
              {dataDetail?.[conditionValue]?.exclusion_keyword && (
                <>
                  <Col span={6} className={styles.itemLabel}>
                    Từ khoá loại trừ
                  </Col>
                  <Col span={18} className={styles.itemContent}>
                    {dataDetail?.[conditionValue]?.exclusion_keyword}
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

  function handleFinish(values: NewsletterDTO) {
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
