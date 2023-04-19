import { LOCAL_USER_PROFILE } from "@/constants/config";
import { dashboardPathWithRole } from "@/pages/router";
import { IUserProfile } from "@/services/auth.type";
import { Result } from "antd";
import { Link } from "react-router-dom";
import { useLocalStorage } from "react-use";

interface Props {
  children: React.ReactNode;
  role: string;
}

export function SectionRoute({ children, role }: Props): JSX.Element | null {
  const [userProfile] = useLocalStorage<IUserProfile>(LOCAL_USER_PROFILE);

  if (userProfile === undefined) {
    return null;
  }

  const hasSectionPermission = userProfile?.role === role;

  if (hasSectionPermission) {
    return <>{children}</>;
  }

  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, bạn không có quyền truy cập vào trang này."
      extra={<Link to={dashboardPathWithRole(userProfile.role) ?? "admin"}>Về dashboard</Link>}
    />
  );
}
