import { ETreeAction, ETreeTag, useTreeStore } from "@/components/tree/tree.store";
import { NewsForm } from "@/pages/news/components/news-form";
import { useMutationNewsSidebar, useNewsSidebar } from "@/pages/news/news.loader";
import { buildTree } from "@/pages/news/news.utils";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, List } from "antd";

import { TableItem } from "./components/table-item";
// import type { DataNode, TreeProps } from "antd/es/tree";
import styles from "./news-category-config.module.less";

export const CategoryNewsConfig = () => {
  const setValues = useTreeStore((state) => state.setValues);
  const { data } = useNewsSidebar();
  const { mutate, isLoading: isMutateLoading } = useMutationNewsSidebar();

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
      <div className={styles.body}>
        <div className={styles.titleTableContainer}>
          <div className={styles.nameCategory}>Tên danh mục</div>
          <div className={styles.detailCategory}>Mô tả</div>
        </div>
        <div className={styles.detailTable}>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 5,
              size: "default",
              position: "bottom",
            }}
            dataSource={linhVucTree}
            renderItem={(values) => {
              return <TableItem values={values} />;
            }}
          />
        </div>
      </div>
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
    mutate(values, {
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

// const templateCategorydata: DataNode[] = [
//   {
//     title: "Danh sách tin mẫu",
//     key: "0-0",
//     children: [
//       {
//         title: "Tin mẫu 1",
//         key: "0-0-0",
//       },
//       {
//         title: "Tin mẫu 2",
//         key: "0-0-1",
//       },
//       {
//         title: "Tin mẫu 3",
//         key: "0-0-2",
//       },
//     ],
//   },
// ];

// const TenplateCategory = () => {
//   const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
//     console.log("selected", selectedKeys, info);
//   };
//   return (
//     <div className={styles.itemContainer}>
//       <Tree
//         showLine
//         switcherIcon={<DownOutlined />}
//         // defaultExpandedKeys={["0-0-0"]}
//         onSelect={onSelect}
//         treeData={templateCategorydata}
//       />
//     </div>
// );
// };
