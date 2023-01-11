import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./pages/app";
import { AuthLayout } from "./pages/auth/";
import { DashboardLayout } from "./pages/dashboard/";
import { ErrorBoundary } from "./pages/errors/error-boundary";
import { QuickReport, SyntheticReport, PeriodicReport, ReportLayout } from "./pages/reports";
import {
  analysisPath,
  authForgotPasswordPath,
  authLoginPath,
  dashboardAdminPath,
  dashboardExpertPath,
  dashboardLeaderPath,
  searchPath,
  databasePath,
  sourceConfigPath,
  homePath,
  newsPath,
  organizationPath,
  reportPath,
  reportPeriodicPath,
  reportQuickPath,
  reportSyntheticPath,
  settingPath,
  socialDashboardPath,
  socialFacebookPath,
  socialPath,
  socialPriorityObjectPath,
  socialTiktokPath,
  socialTwitterPath,
  pipelineDashboardPath,
  pipelineDataProcessingPath,
  pipelineInformationGathering,
  pipelineInformationGatheringCreatePath,
  pipelineInformationGatheringDetail,
  appPath,
  SourceListPath,
  userManagerListPath,
} from "./pages/router";
import {
  SocialLayout,
  SocialDashboard,
  PriorityObject,
  Facebook,
  Twitter,
  Tiktok,
} from "./pages/social";

import { LeaderLayout } from "./pages/dashboard/leader/leader.page";
import { LoginPage } from "./pages/auth/login/login";
import { ForgotPasswordPage } from "./pages/auth/forgot-password/forgot-password";
import { Search } from "./pages/search/search.page";
import { ExpertPage } from "./pages/dashboard/expert/expert.page";
import { AdminPage } from "./pages/dashboard/admin/admin.page";
import {
  DashboardStatistics,
  PipelineLayout,
  DataProcessing,
  InformationGathering,
  InformationGatheringCreate,
  InformationGatheringDetail,
} from "./pages/pipeline";
import { SourceManaLayout } from "./pages/sourceManagerment/components";
import { ViewList } from "./pages/list-application";
import { SourceList } from "./pages/list-source";
import { SourceConfigLayout } from "./pages/source-config/components";
import { SourceConfigList } from "./pages/source-config";
import { UserManagerList } from "./pages/user-manager";
import { NewsLayout, NewsListPage } from "./pages/news";

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
            element: <DataProcessing />,
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
        path: settingPath,
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
