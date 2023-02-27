export const homePath = "/";

export const authLoginPath = "/login";
export const authForgotPasswordPath = "/forgot-password";

export const dashboardLeaderPath = "/dashboard/leader";
export const dashboardExpertPath = "/dashboard/expert";
export const dashboardAdminPath = "/dashboard/admin";

export const searchPath = "/search";

export const newsPath = "/news";
export const getNewsDetailUrl = (id: string | number) => `/news/${id}`;

export const organizationPath = "/organization";
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

export const reportPeriodicPath = "/report/periodic";
export const getReportPeriodicUrl = (reportId: string | number) => `/report/periodic/${reportId}`;

export const reportQuickPath = "/report/quick/:id";
export const getReportQuickUrl = (reportId: string | number) => `/report/quick/${reportId}`;

export const reportSyntheticPath = "/report/synthetic/:id";
export const getReportSyntheticUrl = (reportId: string | number) => `/report/synthetic/${reportId}`;

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
export const newsAccountConfigPath = "/config/news-account";
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
export const sourceListPath = "/source/list";
