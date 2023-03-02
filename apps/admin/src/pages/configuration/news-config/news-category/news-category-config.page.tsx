import { ETreeAction, ETreeTag, useTreeStore } from "@/components/tree/tree.store";
import { NewsForm } from "@/pages/news/components/news-form";
import {
  useMutationNewsSidebar,
  useNewsSidebar,
  useNewsletterDetail,
} from "@/pages/news/news.loader";
import { buildTree } from "@/pages/news/news.utils";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Descriptions, Input, List, Row, Typography } from "antd";
import { useSearchParams } from "react-router-dom";

import { TableItem } from "./components/table-item";
import styles from "./news-category-config.module.less";

export const CategoryNewsConfig = () => {
  const setValues = useTreeStore((state) => state.setValues);
  const { data } = useNewsSidebar();
  const [searchParams] = useSearchParams();
  const { mutateAsync, isLoading: isMutateLoading } = useMutationNewsSidebar();
  const newsletterId = searchParams.get("newsletter_id");
  const { data: dataDetail } = useNewsletterDetail(newsletterId ?? null, {});
  const linhVucTree = data?.linh_vuc && buildTree(data.linh_vuc);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>
          <div className={styles.searchButton}>
            <Input.Search placeholder="Tìm kiếm" />
          </div>
        </div>
        <div className={styles.rightHeader}>
          <Button
            onClick={handleClickCreate}
            type="primary"
            className={styles.addButton}
            icon={<PlusOutlined />}
          >
            Thêm
          </Button>
        </div>
      </div>
      <Row>
        <Col span={13} className={styles.col}>
          <div className={styles.nameCategory}>Tên danh mục</div>
          <TableItem values={linhVucTree} />
        </Col>
        <Col span={11} className={styles.col}>
          <div className={styles.nameCategory}>Mô tả</div>
          <Descriptions bordered>
            <Descriptions.Item label="Tên danh mục" span={3}>
              {dataDetail?.title}
            </Descriptions.Item>
            {dataDetail?.required_keyword && (
              <Descriptions.Item label="Từ khoá bắt buộc" span={3}>
                {dataDetail?.required_keyword?.map((i: any) => i + ", ")}
              </Descriptions.Item>
            )}
            {dataDetail?.required_keyword && (
              <Descriptions.Item label="Từ khoá loại trừ" span={3}>
                {dataDetail?.exclusion_keyword}
              </Descriptions.Item>
            )}
          </Descriptions>
          {dataDetail?.news_samples?.length > 0 && (
            <Card>
              <Typography.Text>Tin mẫu</Typography.Text>
              <List
                dataSource={dataDetail?.news_samples}
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

      <NewsForm onFinish={handleFinish} confirmLoading={isMutateLoading} />
    </div>
  );

  function handleClickCreate() {
    setValues({
      tag: ETreeTag.LINH_VUC,
      action: ETreeAction.CREATE,
      data: null,
    });
  }

  function handleFinish(values: any) {
    return mutateAsync(values, {
      onSuccess: () => {
        setValues({
          tag: null,
          action: null,
          data: null,
        });
      },
    });
  }
};
