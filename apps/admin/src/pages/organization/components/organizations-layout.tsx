import { EarthIcon, FlagIcon, GroupIcon, UserTieIcon } from "@/assets/svg";
import { AppContainer } from "@/pages/app";
import { getOrganizationsDetailUrl, organizationGraphPath } from "@/pages/router";
import { Input, Menu, MenuProps, Pagination } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

import { OBJECT_TYPE, useObjectList } from "../organizations.loader";
import styles from "./organizations-layout.module.less";

export const OrganizationsLayout: React.FC = () => {
  return (
    <AppContainer sidebar={<Sidebar />}>
      <Outlet />
    </AppContainer>
  );
};

function buildMenuItem(
  { data, total }: { data: any[]; total: number },
  key: string,
  { onSearch }: { onSearch: () => void },
  { onChange }: { onChange: () => void },
) {
  return [
    {
      label: <Input.Search placeholder="Tìm kiếm" onSearch={onSearch} />,
      key: key + "search",
      className: styles.search,
      disabled: true,
    },
    ...data?.map((i) => ({
      label: i.name,
      key: i._id,
    })),
    {
      label: (
        <Pagination
          defaultCurrent={1}
          showSizeChanger={false}
          pageSize={5}
          total={total}
          onChange={onChange}
        />
      ),
      key: key + "paginate",
      className: styles.pagination,
    },
  ];
}

function Sidebar() {
  const navigate = useNavigate();
  const { data: dataDoiTuong } = useObjectList(OBJECT_TYPE.DOI_TUONG, "", {});
  const { data: dataToChuc } = useObjectList(OBJECT_TYPE.TO_CHUC, "", {});
  const { data: dataQuocGia } = useObjectList(OBJECT_TYPE.QUOC_GIA, "", {});

  const items: MenuProps["items"] = [
    {
      label: "Danh mục đối tượng",
      key: "doi_tuong",
      icon: <UserTieIcon />,
      children: buildMenuItem(
        dataDoiTuong ?? { data: [], total: 0 },
        "doi_tuong",
        { onSearch: () => {} },
        { onChange: () => {} },
      ),
    },
    {
      label: "Danh mục tổ chức",
      key: "to_chuc",
      icon: <GroupIcon />,
      children: buildMenuItem(
        dataToChuc ?? { data: [], total: 0 },
        "to_chuc",
        { onSearch: () => {} },
        { onChange: () => {} },
      ),
    },
    {
      label: "Danh mục quốc gia",
      key: "quoc_gia",
      icon: <FlagIcon />,
      children: buildMenuItem(
        dataQuocGia ?? { data: [], total: 0 },
        "quoc_gia",
        { onSearch: () => {} },
        { onChange: () => {} },
      ),
    },
    {
      label: "Đồ thị quan hệ quốc tế",
      key: organizationGraphPath,
      icon: <EarthIcon />,
    },
  ];

  return (
    <Menu
      mode="inline"
      items={items}
      defaultOpenKeys={["doi_tuong", "to_chuc", "quoc_gia"]}
      onClick={handleClickMenu}
    />
  );

  function handleClickMenu({ key }: { key: string }) {
    if (key === organizationGraphPath) {
      navigate(organizationGraphPath);
    } else {
      navigate(getOrganizationsDetailUrl(key));
    }
  }
}
