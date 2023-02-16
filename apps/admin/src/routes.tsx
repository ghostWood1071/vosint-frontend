import { Navigate, createBrowserRouter } from "react-router-dom";

import { SplashScreen } from "./components";
import { AppLayout } from "./pages/app";
import { AuthLayout } from "./pages/auth/";
import { ForgotPasswordPage } from "./pages/auth/forgot-password/forgot-password";
import { LoginPage } from "./pages/auth/login/login";
import {
  CategoryNewsConfig,
  ConfigLayout,
  FacebookConfig,
  GatheringDataConfig,
  NewsFromAccountsConfig,
  ProxyConfig,
  SourceNewsConfig,
  TiktokConfig,
  TwitterConfig,
} from "./pages/configuration";
import { DashboardLayout } from "./pages/dashboard/";
import { AdminPage } from "./pages/dashboard/admin/admin.page";
import { ExpertPage } from "./pages/dashboard/expert/expert.page";
import { LeaderLayout } from "./pages/dashboard/leader/leader.page";
import { ErrorBoundary } from "./pages/errors/error-boundary";
import { ViewList } from "./pages/list-application";
import { SourceList } from "./pages/list-source";
import { NewsLayout, NewsListPage } from "./pages/news";
import {
  DashboardStatistics,
  DataProcessing,
  InformationGathering,
  InformationGatheringCreate,
  InformationGatheringDetail,
  PipelineLayout,
} from "./pages/pipeline";
import { PeriodicReport, QuickReport, ReportLayout, SyntheticReport } from "./pages/reports";
import {
  SourceListPath,
  analysisPath,
  appPath,
  authForgotPasswordPath,
  authLoginPath,
  categoryNewsConfigPath,
  configPath,
  dashboardAdminPath,
  dashboardExpertPath,
  dashboardLeaderPath,
  databasePath,
  facebookConfigPath,
  gatheringDataConfigPath,
  homePath,
  newsFromAccountsConfigPath,
  newsPath,
  organizationPath,
  pipelineDashboardPath,
  pipelineDataProcessingPath,
  pipelineInformationGathering,
  pipelineInformationGatheringCreatePath,
  pipelineInformationGatheringDetail,
  proxyConfigPath,
  reportPath,
  reportPeriodicPath,
  reportQuickPath,
  reportSyntheticPath,
  searchPath,
  socialDashboardPath,
  socialFacebookPath,
  socialPath,
  socialPriorityObjectPath,
  socialTiktokPath,
  socialTwitterPath,
  sourceConfigPath,
  sourceNewsConfigPath,
  tiktokConfigPath,
  twitterConfigPath,
  userManagerListPath,
} from "./pages/router";
import { Search } from "./pages/search/search.page";
import {
  Facebook,
  PriorityObject,
  SocialDashboard,
  SocialLayout,
  Tiktok,
  Twitter,
} from "./pages/social";
import { SourceConfigList } from "./pages/source-config";
import { SourceConfigLayout } from "./pages/source-config/components";
import { SourceManaLayout } from "./pages/sourceManagerment/components";
import { UserManagerList } from "./pages/user-manager";

export const routers = createBrowserRouter([
  {
    path: homePath,
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <NewsLayout />,
        children: [
          {
            path: newsPath,
            element: <NewsListPage />,
          },
        ],
      },
      {
        path: organizationPath,
      },
      {
        element: <SocialLayout />,
        children: [
          {
            path: socialPath,
            element: <Navigate to={socialDashboardPath} />,
          },
          {
            path: socialDashboardPath,
            element: <SocialDashboard />,
          },
          {
            path: socialPriorityObjectPath,
            element: <PriorityObject />,
          },
          {
            path: socialFacebookPath,
            element: <Facebook />,
          },
          {
            path: socialTwitterPath,
            element: <Twitter />,
          },
          {
            path: socialTiktokPath,
            element: <Tiktok />,
          },
        ],
      },
      {
        path: analysisPath,
      },
      {
        path: databasePath,
      },
      {
        element: <ReportLayout />,
        children: [
          {
            path: reportPath,
            element: <Navigate to={reportQuickPath} />,
          },
          {
            path: reportPeriodicPath,
            element: <PeriodicReport />,
          },
          {
            path: reportQuickPath,
            element: <QuickReport />,
          },
          {
            path: reportSyntheticPath,
            element: <SyntheticReport />,
          },
        ],
      },
      {
        element: <PipelineLayout />,
        children: [
          {
            path: pipelineDashboardPath,
            element: <DashboardStatistics />,
          },
          {
            path: pipelineDataProcessingPath,
            element: <SplashScreen />,
          },
          {
            path: pipelineInformationGathering,
            element: <InformationGathering />,
          },
          {
            path: pipelineInformationGatheringCreatePath,
            element: <InformationGatheringCreate />,
          },
          {
            path: pipelineInformationGatheringDetail,
            element: <InformationGatheringDetail />,
          },
        ],
      },
      {
        element: <ConfigLayout />,
        children: [
          {
            path: configPath,
            element: <Navigate to={categoryNewsConfigPath} />,
          },
          {
            path: categoryNewsConfigPath,
            element: <CategoryNewsConfig />,
          },
          {
            path: facebookConfigPath,
            element: <FacebookConfig />,
          },
          {
            path: tiktokConfigPath,
            element: <TiktokConfig />,
          },
          {
            path: twitterConfigPath,
            element: <TwitterConfig />,
          },
          {
            path: gatheringDataConfigPath,
            element: <GatheringDataConfig />,
          },
          {
            path: proxyConfigPath,
            element: <ProxyConfig />,
          },
          {
            path: newsFromAccountsConfigPath,
            element: <NewsFromAccountsConfig />,
          },
          {
            path: sourceNewsConfigPath,
            element: <SourceNewsConfig />,
          },
        ],
      },

      {
        element: <SourceConfigLayout />,
        children: [
          {
            path: sourceConfigPath,
            element: <SourceConfigList />,
          },
          {
            path: userManagerListPath,
            element: <UserManagerList />,
          },
        ],
      },
      {
        element: <SourceManaLayout />,
        children: [
          {
            path: appPath,
            element: <ViewList />,
          },
          {
            path: SourceListPath,
            element: <SourceList />,
          },
        ],
      },
    ],
  },
  {
    element: <DashboardLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: dashboardLeaderPath,
        element: <LeaderLayout />,
      },
      {
        path: dashboardExpertPath,
        element: <ExpertPage />,
      },
      {
        path: dashboardAdminPath,
        element: <AdminPage />,
      },
    ],
  },
  {
    path: searchPath,
    element: <Search />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: authLoginPath,
        element: <LoginPage />,
      },
      {
        path: authForgotPasswordPath,
        element: <ForgotPasswordPage />,
      },
    ],
  },
]);
