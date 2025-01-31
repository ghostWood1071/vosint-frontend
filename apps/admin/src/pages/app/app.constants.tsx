import {
  AppIcon,
  EventIcon,
  NewsIcon,
  OrganizationIcon,
  ReportIcon,
  SettingIcon,
  SocialIcon,
} from "@/assets/svg";
import {
  configPath,
  eventPath,
  newsPath,
  organizationPath,
  reportPath,
  socialPath,
  sourceGroupPath,
  systemEventPath,
} from "@/pages/router";

export const DEFAULT_ENTITY_EXPLORER_WIDTH = 270;
export const DEFAULT_ENTITY_EXPLORER_PINNED = false;
export const DEFAULT_ENTITY_EXPLORER_ACTIVE = false;

export const NAVBAR_HEADER_ADMIN = [
  {
    title: "News",
    to: systemEventPath,
    icon: <NewsIcon />,
  },
  {
    title: "Organization",
    to: organizationPath,
    icon: <OrganizationIcon />,
  },
  {
    title: "Social",
    to: socialPath,
    icon: <SocialIcon />,
  },
  // {
  //   title: "Analysis",
  //   to: analysisPath,
  //   icon: <AnalysisIcon />,
  // },
  // {
  //   title: "Database",
  //   to: databasePath,
  //   icon: <DatabaseIcon />,
  // },
  {
    title: "Event",
    to: eventPath,
    icon: <EventIcon />,
  },
  {
    title: "Report",
    to: reportPath,
    icon: <ReportIcon />,
  },
  {
    title: "App",
    to: sourceGroupPath,
    icon: <AppIcon />,
  },
  {
    title: "Configuration",
    to: configPath,
    icon: <SettingIcon />,
  },
];

export const NAVBAR_HEADER = [
  {
    title: "News",
    to: systemEventPath,
    icon: <NewsIcon />,
  },
  {
    title: "Organization",
    to: organizationPath,
    icon: <OrganizationIcon />,
  },
  {
    title: "Social",
    to: socialPath,
    icon: <SocialIcon />,
  },
  // {
  //   title: "Analysis",
  //   to: analysisPath,
  //   icon: <AnalysisIcon />,
  // },
  // {
  //   title: "Database",
  //   to: databasePath,
  //   icon: <DatabaseIcon />,
  // },
  {
    title: "Event",
    to: eventPath,
    icon: <EventIcon />,
  },
  {
    title: "Report",
    to: reportPath,
    icon: <ReportIcon />,
  },
  {
    title: "App",
    to: sourceGroupPath,
    icon: <AppIcon />,
  },
];
