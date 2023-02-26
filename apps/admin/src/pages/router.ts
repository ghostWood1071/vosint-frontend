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
export const pipelineInformationGatheringCreatePath = "/pipeline/information-gathering/create";
export const pipelineInformationGathering = "/pipeline/information-gathering";
export const pipelineInformationGatheringDetail = "/pipeline/information-gathering/:id";
export const getPipelineInformationGatheringUrl = (pipelineId: string | number) =>
  `/pipeline/information-gathering/${pipelineId}`;

export const pipelinePath = pipelineDashboardPath;

export const configPath = "/config";
export const categoryNewsConfigPath = "/config/category-news-config";
export const facebookConfigPath = "/config/facebook-config";
export const tiktokConfigPath = "/config/tiktok-config";
export const twitterConfigPath = "/config/twitter-config";
export const gatheringDataConfigPath = "/config/gathering-data-config";
export const countryCateConfigPath = "/config/country-cate-config";
export const objectCateConfigPath = "/config/object-cate-config";
export const organizationCateConfigPath = "/config/organization-cate-config";

export const proxyConfigPath = "/config/proxy-config";
export const newsFromAccountsConfigPath = "/config/news-from-accounts-config";
export const sourceNewsConfigPath = "/config/source-news-config";

export const sourceConfigPath = "/source-config";
export const userManagerListPath = "/source-config/user-manager";

export const dashboardPathWithRole = (role: string) => {
  const roles: Record<string, string> = {
    admin: dashboardAdminPath,
    expert: dashboardExpertPath,
    leader: dashboardLeaderPath,
  };
  return roles[role];
};

export const appPath = "/list-app";
export const SourceListPath = "/list-source";
