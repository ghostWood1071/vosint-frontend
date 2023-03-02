import { AppContainer } from "@/pages/app";
import { getOrganizationsDetailUrl, organizationGraphPath } from "@/pages/router";
import { Input, Menu, MenuProps, Pagination } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

import { OBJECT_TYPE, useObjectList } from "../organizations.loader";

export const OrganizationsLayout: React.FC = () => {
  return (
    <AppContainer sidebar={<Sidebar />}>
      <Outlet />
    </AppContainer>
  );
};

function buildMenuItem(items: any[]) {
  return items?.map((i) => ({
    label: i.name,
    key: i._id,
  }));
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
      children: [
        {
          label: <Input.Search placeholder="Tìm kiếm" style={{ marginTop: 3 }} />,
          key: "doi_tuong_search",
        },
        ...buildMenuItem(dataDoiTuong?.data ?? []),
        {
          label: <Pagination simple defaultCurrent={1} pageSize={5} total={dataDoiTuong?.total} />,
          key: "doi_tuong_pagination",
        },
      ],
    },
    {
      label: "Danh mục tổ chức",
      key: "to_chuc",
      children: [
        {
          label: <Input.Search placeholder="Tìm kiếm" style={{ marginTop: 3 }} />,
          key: "to_chuc_search",
        },
        ...buildMenuItem(dataToChuc?.data ?? []),
        {
          label: <Pagination simple defaultCurrent={1} pageSize={5} total={dataToChuc?.total} />,
          key: "to_chuc_pagination",
        },
      ],
    },
    {
      label: "Danh mục quốc gia",
      key: "quoc_gia",
      children: [
        {
          label: <Input.Search placeholder="Tìm kiếm" style={{ marginTop: 3 }} />,
          key: "quoc_gia_search",
        },
        ...buildMenuItem(dataQuocGia?.data ?? []),
        {
          label: <Pagination simple defaultCurrent={1} pageSize={5} total={dataQuocGia?.total} />,
          key: "quoc_gia_pagination",
        },
      ],
    },
    {
      label: "Đồ thị quan hệ quốc tế",
      key: organizationGraphPath,
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
