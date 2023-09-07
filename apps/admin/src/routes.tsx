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
import { EventLayout, EventPage, SystemEventPage } from "./pages/events";
import { EventDetailPage } from "./pages/events/components/event-detail.page";
import { NewsDetailPage, NewsLayout, NewsListPage, NewsTTXVNPage } from "./pages/news";
import { OrganizationsDetailPage, OrganizationsLayout } from "./pages/organization";
import { InternationalRelationshipGraph } from "./pages/organization/international-relationship-graph/component/international-relationship-graph";
import {
  DashboardStatistics,
  PipelineDetail,
  PipelineLayout,
  PipelineList,
} from "./pages/pipeline";
import {
  PeriodicReport,
  QuickReportCreate,
  QuickReportDetail,
  ReportLayout,
  SynthesisReportCreate,
  SynthesisReportDetail,
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
  newsTTXVNPath,
  objectCateConfigPath,
  organizationCateConfigPath,
  organizationDetailPath,
  organizationGraphPath,
  organizationCrossComparisonPath,
  organizationPath,
  pipelineDashboardPath,
  pipelineDataProcessingPath,
  pipelineDetailPath,
  pipelineListPath,
  proxyConfigPath,
  reportPath,
  reportPeriodicPath,
  reportQuickCreatePath,
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
  systemEventPath,
  tiktokConfigPath,
  ttxvnPath,
  twitterConfigPath,
  userManagementPath,
  organizationGraphPathBackup,
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
import { TTXVNNewsPage } from "./pages/ttxvn";
import { CrossComparison } from "./pages/organization/cross-comparison/component/cross-comparison";
import { InternationalRelationshipGraphBackup } from "./pages/organization/international-relationship-graph/component/international-relationship-graph-backup";
import { EventObjectPage } from "./pages/events/components/event-object.page";

export const routers = createBrowserRouter([
  {
    path: "",
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: homePath,
        element: <Navigate to={systemEventPath} />,
      },
      {
        element: <NewsLayout />,
        children: [
          {
            path: newsTTXVNPath,
            element: <NewsTTXVNPage />,
          },
          {
            path: systemEventPath,
            element: <SystemEventPage />,
          },
          {
            path: "/news/:newsletterId",
            element: <NewsDetailPage />,
          },
          {
            path: "/news/:newsletterId/:tag",
            element: <NewsDetailPage />,
          },
          {
            path: "/events/:newsletterId",
            element: <EventDetailPage />,
          },
          {
            path: "/events/:newsletterId/:tag",
            element: <EventDetailPage />,
          },
          // {
          //   path: "/event-list",
          //   element: <EventDetailPage />,
          // },
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
          
          // {
          //   path: organizationGraphPathBackup,
          //   element: <InternationalRelationshipGraphBackup />,
          // },
          {
            path: organizationCrossComparisonPath,
            element: <CrossComparison />,
          },
          {
            path: "/organization/:newsletterId/events",
            element: <EventObjectPage />,
          },
          {
            path: "/organization/events",
            element: <EventObjectPage />,
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
          // {
          //   path: "/event/:newsletterId",
          //   element: <EventDetailPage />,
          // },
          // {
          //   path: "/event/:newsletterId/:tag",
          //   element: <EventDetailPage />,
          // },
          // {
          //   path: "/event/:newsletterId/:tag",
          //   element: <EventDetailPage />,
          // },
        ],
      },
      {
        element: <ReportLayout />,
        children: [
          {
            path: reportPath,
            element: <Navigate to={reportQuickCreatePath} />,
          },
          {
            path: reportPeriodicPath,
            element: <PeriodicReport />,
          },
          {
            path: reportQuickPath,
            element: <QuickReportDetail />,
          },
          {
            path: reportQuickCreatePath,
            element: <QuickReportCreate />,
          },
          {
            path: reportSyntheticPath,
            element: <Navigate to={reportSyntheticCreatePath} />,
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
            path: ttxvnPath,
            element: <TTXVNNewsPage />,
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
