import { Navigate, createBrowserRouter } from "react-router-dom";

import { SplashScreen } from "./components";
import { AppLayout } from "./pages/app";
import { AuthLayout } from "./pages/auth/";
import { SectionRoute } from "./pages/auth/components/section-route";
import { ForgotPasswordPage } from "./pages/auth/forgot-password/forgot-password";
import { LoginPage } from "./pages/auth/login/login";
import {
  AccountForMonitoringFacebook,
  AccountForMonitoringTiktok,
  AccountForMonitoringTwitter,
  CollectDataConfig,
  ConfigurationLayout,
  CountryCate,
  FacebookConfig,
  NewsCategoryConfig,
  NewsSourceConfig,
  ObjectCate,
  OrganizationCate,
  ProxyConfig,
  TiktokConfig,
  TwitterConfig,
  UserManagement,
} from "./pages/configuration";
import { DashboardLayout } from "./pages/dashboard/";
import { AdminPage } from "./pages/dashboard/admin/admin.page";
import { ExpertPage } from "./pages/dashboard/expert/expert.page";
import { LeaderLayout } from "./pages/dashboard/leader/leader.page";
import { ErrorBoundary } from "./pages/errors/error-boundary";
import { EventLayout, EventPage } from "./pages/events";
import { NewsDetailPage, NewsLayout, NewsListPage } from "./pages/news";
import { OrganizationsDetailPage, OrganizationsLayout } from "./pages/organization";
import { InternationalRelationshipGraph } from "./pages/organization/international-relationship-graph/component/international-relationship-graph";
import {
  DashboardStatistics,
  PipelineCreate,
  PipelineDetail,
  PipelineLayout,
  PipelineList,
} from "./pages/pipeline";
import {
  PeriodicReport,
  QuickReport,
  ReportLayout,
  SynthesisReportCreate,
  SynthesisReportDetail,
  SyntheticReport,
} from "./pages/reports";
import {
  accountForMonitoringFacebookPath,
  accountForMonitoringTiktokPath,
  accountForMonitoringTwitterPath,
  authForgotPasswordPath,
  authLoginPath,
  collectDataConfigPath,
  configPath,
  countryCateConfigPath,
  dashboardAdminPath,
  dashboardExpertPath,
  dashboardLeaderPath,
  eventPath,
  facebookConfigPath,
  homePath,
  newsCategoryConfigPath,
  newsPath,
  newsSourceConfigPath,
  objectCateConfigPath,
  organizationCateConfigPath,
  organizationDetailPath,
  organizationGraphPath,
  organizationPath,
  pipelineCreatePath,
  pipelineDashboardPath,
  pipelineDataProcessingPath,
  pipelineDetailPath,
  pipelineListPath,
  proxyConfigPath,
  reportPath,
  reportPeriodicPath,
  reportQuickPath,
  reportSyntheticCreatePath,
  reportSyntheticDetailPath,
  reportSyntheticPath,
  searchPath,
  socialDashboardPath,
  socialFacebookPath,
  socialPath,
  socialPriorityObjectPath,
  socialTiktokPath,
  socialTwitterPath,
  sourceGroupPath,
  tiktokConfigPath,
  twitterConfigPath,
  userManagementPath,
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
import { SourceGroup, SourceManagementLayout } from "./pages/source";

export const routers = createBrowserRouter([
  {
    path: "",
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: homePath,
        element: <Navigate to={newsPath} />,
      },
      {
        element: <NewsLayout />,
        children: [
          {
            path: newsPath,
            element: <NewsListPage />,
          },
          {
            path: "/news/:newsletterId",
            element: <NewsDetailPage />,
          },
          {
            path: "/news/:newsletterId/:tag",
            element: <NewsDetailPage />,
          },
        ],
      },
      {
        element: <OrganizationsLayout />,
        children: [
          {
            path: organizationPath,
            element: <NewsListPage />,
          },
          {
            path: organizationDetailPath,
            element: <OrganizationsDetailPage />,
          },
          {
            path: organizationGraphPath,
            element: <InternationalRelationshipGraph />,
          },
        ],
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
        element: <EventLayout />,
        children: [
          {
            path: eventPath,
            element: <EventPage />,
          },
        ],
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
          {
            path: reportSyntheticDetailPath,
            element: <SynthesisReportDetail />,
          },
          {
            path: reportSyntheticCreatePath,
            element: <SynthesisReportCreate />,
          },
        ],
      },
      {
        element: (
          <SectionRoute role="admin">
            <PipelineLayout />
          </SectionRoute>
        ),
        children: [
          {
            path: pipelineDashboardPath,
            element: <DashboardStatistics />,
          },
          {
            path: pipelineDataProcessingPath,
            element: <SplashScreen />,
          },
        ],
      },
      {
        element: (
          <SectionRoute role="admin">
            <ConfigurationLayout />
          </SectionRoute>
        ),
        children: [
          {
            path: configPath,
            element: <Navigate to={newsCategoryConfigPath} />,
          },
          {
            path: newsCategoryConfigPath,
            element: <NewsCategoryConfig />,
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
            path: collectDataConfigPath,
            element: <CollectDataConfig />,
          },
          {
            path: proxyConfigPath,
            element: <ProxyConfig />,
          },
          {
            path: accountForMonitoringFacebookPath,
            element: <AccountForMonitoringFacebook />,
          },
          {
            path: accountForMonitoringTiktokPath,
            element: <AccountForMonitoringTiktok />,
          },
          {
            path: accountForMonitoringTwitterPath,
            element: <AccountForMonitoringTwitter />,
          },
          {
            path: newsSourceConfigPath,
            element: <NewsSourceConfig />,
          },
          {
            path: pipelineListPath,
            element: <PipelineList />,
          },
          {
            path: pipelineCreatePath,
            element: <PipelineCreate />,
          },
          {
            path: pipelineDetailPath,
            element: <PipelineDetail />,
          },
          {
            path: userManagementPath,
            element: <UserManagement />,
          },
          {
            path: organizationCateConfigPath,
            element: <OrganizationCate />,
          },
          {
            path: countryCateConfigPath,
            element: <CountryCate />,
          },
          {
            path: objectCateConfigPath,
            element: <ObjectCate />,
          },
        ],
      },
      {
        element: <SourceManagementLayout />,
        children: [
          {
            path: sourceGroupPath,
            element: <SourceGroup />,
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
