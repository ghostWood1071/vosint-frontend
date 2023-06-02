import { ETreeTag } from "@/components/news/news-state";

export const homePath = "/";

export const authLoginPath = "/login";
export const authForgotPasswordPath = "/forgot-password";

export const dashboardLeaderPath = "/dashboard/leader";
export const dashboardExpertPath = "/dashboard/expert";
export const dashboardAdminPath = "/dashboard/admin";

export const searchPath = "/search";

export const newsPath = "/news";
export const getNewsDetailUrl = (id: string | number, tag?: ETreeTag) => `/news/${id}/${tag ?? ""}`;

export const organizationPath = "/organization";
export const organizationDetailPath = "/organization/:id";
export const getOrganizationsDetailUrl = (id: string | number) => `/organization/${id}`;
export const organizationGraphPath = "/organization/international-relationship-graph";

export const socialPath = "/social";
export const socialDashboardPath = "/social/dashboard";
export const socialPriorityObjectPath = "/social/priority-object";
export const socialFacebookPath = "/social/facebook";
export const socialTwitterPath = "/social/twitter";
export const socialTiktokPath = "/social/tiktok";

export const analysisPath = "/analysis";

export const databasePath = "/database";

export const reportPath = "/report";

export const reportPeriodicPath = "/report/periodic/:id";
export const getPeriodicReportUrl = (reportId: string | number) => `/report/periodic/${reportId}`;

export const reportQuickPath = "/report/quick/:id";
export const getReportQuickUrl = (reportId: string | number) => `/report/quick/${reportId}`;

export const reportSyntheticPath = "/report/synthesis";
export const reportSyntheticCreatePath = "/report/synthesis/create";
export const reportSyntheticDetailPath = "/report/synthesis/:id";
export const getSyntheticReportDetailUrl = (reportId: string | number) =>
  `/report/synthesis/${reportId}`;

export const pipelineDashboardPath = "/pipeline/dashboard";
export const pipelineDataProcessingPath = "/pipeline/data-processing";
export const pipelineCreatePath = "/config/pipeline/create";
export const pipelineListPath = "/config/pipeline";
export const pipelineDetailPath = "/config/pipeline/:id";
export const getPipelineDetailPath = (pipelineId: string | number) =>
  `/config/pipeline/${pipelineId}`;

export const pipelinePath = pipelineDashboardPath;

export const configPath = "/config";
export const newsCategoryConfigPath = "/config/news-category";
export const facebookConfigPath = "/config/facebook";
export const tiktokConfigPath = "/config/tiktok";
export const twitterConfigPath = "/config/twitter";
export const collectDataConfigPath = "/config/collect-data";
export const proxyConfigPath = "/config/proxy-config";
export const accountForMonitoringFacebookPath = "/config/account-for-facebook";
export const accountForMonitoringTwitterPath = "/config/account-for-twitter";
export const accountForMonitoringTiktokPath = "/config/account-for-tiktok";
export const newsSourceConfigPath = "/config/news-source";
export const countryCateConfigPath = "/config/country-cate-config";
export const objectCateConfigPath = "/config/object-cate-config";
export const organizationCateConfigPath = "/config/organization-cate-config";

export const sourceConfigPath = "/config/news";
export const userManagementPath = "/config/user";

export const dashboardPathWithRole = (role: string) => {
  const roles: Record<string, string> = {
    admin: dashboardAdminPath,
    expert: dashboardExpertPath,
    leader: dashboardLeaderPath,
  };
  return roles[role];
};

export const sourceGroupPath = "/source/group";
export const appPath = "/source/app";
export const eventPath = "/event";
