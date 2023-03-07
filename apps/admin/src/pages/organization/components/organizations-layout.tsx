import { EarthIcon, FlagIcon, GroupIcon, UserTieIcon } from "@/assets/svg";
import { AppContainer } from "@/pages/app";
import { getOrganizationsDetailUrl, organizationGraphPath } from "@/pages/router";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Input, Menu, MenuProps, Pagination, Space, Typography } from "antd";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

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
  { onSearch }: { onSearch: (key: string) => (value: string) => void },
  { onChange }: { onChange: (key: string) => (page: number) => void },
) {
  return [
    {
      label: (
        <Input.Search placeholder="Tìm kiếm" onSearch={onSearch(key)} className={styles.input} />
      ),
      key: key + "search",
      className: styles.search,
      disabled: true,
    },
    ...data?.map((i) => ({
      label: (
        <Space>
          <Avatar
            src={i?.avatar_url ? i.avatar_url : <UserOutlined />}
            style={{ backgroundColor: "#cccccc" }}
          >
            {i?.name}
          </Avatar>
          <Typography.Text>{i?.name}</Typography.Text>
        </Space>
      ),
      key: i._id,
    })),
    {
      label: (
        <Pagination
          defaultCurrent={1}
          showSizeChanger={false}
          pageSize={5}
          total={total}
          onChange={onChange(key)}
          size="small"
        />
      ),
      key: key + "paginate",
      className: styles.pagination,
      disabled: true,
    },
  ];
}

function Sidebar(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: dataDoiTuong } = useObjectList(OBJECT_TYPE.DOI_TUONG, {
    name: searchParams.get(OBJECT_TYPE.DOI_TUONG + "_name") ?? "",
    skip: searchParams.get(OBJECT_TYPE.DOI_TUONG + "_skip") ?? 1,
    limit: 5,
  });

  const { data: dataToChuc } = useObjectList(OBJECT_TYPE.TO_CHUC, {
    name: searchParams.get(OBJECT_TYPE.TO_CHUC + "_name") ?? "",
    skip: searchParams.get(OBJECT_TYPE.TO_CHUC + "_skip") ?? 1,
    limit: 5,
  });

  const { data: dataQuocGia } = useObjectList(OBJECT_TYPE.QUOC_GIA, {
    name: searchParams.get(OBJECT_TYPE.QUOC_GIA + "_name") ?? "",
    skip: searchParams.get(OBJECT_TYPE.QUOC_GIA + "_skip") ?? 1,
    limit: 5,
  });

  const items: MenuProps["items"] = [
    {
      label: "Danh mục đối tượng",
      key: OBJECT_TYPE.DOI_TUONG,
      icon: <UserTieIcon />,
      children: buildMenuItem(
        dataDoiTuong ?? { data: [], total: 0 },
        OBJECT_TYPE.DOI_TUONG,
        { onSearch: handleChangeName },
        { onChange: handleChangePaginate },
      ),
    },
    {
      label: "Danh mục tổ chức",
      key: OBJECT_TYPE.TO_CHUC,
      icon: <GroupIcon />,
      children: buildMenuItem(
        dataToChuc ?? { data: [], total: 0 },
        OBJECT_TYPE.TO_CHUC,
        { onSearch: handleChangeName },
        { onChange: handleChangePaginate },
      ),
    },
    {
      label: "Danh mục quốc gia",
      key: OBJECT_TYPE.QUOC_GIA,
      icon: <FlagIcon />,
      children: buildMenuItem(
        dataQuocGia ?? { data: [], total: 0 },
        OBJECT_TYPE.QUOC_GIA,
        { onSearch: handleChangeName },
        { onChange: handleChangePaginate },
      ),
    },
    {
      label: "Đồ thị quan hệ quốc tế",
      key: organizationGraphPath,
      icon: <EarthIcon />,
    },
  ];

  return <Menu mode="inline" items={items} onClick={handleClickMenu} />;

  function handleClickMenu({ key }: { key: string }) {
    if (key === organizationGraphPath) {
      navigate(organizationGraphPath);
    } else {
      navigate(getOrganizationsDetailUrl(key));
    }
  }

  function handleChangePaginate(key: string) {
    return function (page: number) {
      searchParams.set(key + "_skip", page + "");
      setSearchParams(searchParams);
    };
  }

  function handleChangeName(key: string) {
    return function (value: string) {
      searchParams.set(key + "_name", value);
      setSearchParams(searchParams);
    };
  }
}
