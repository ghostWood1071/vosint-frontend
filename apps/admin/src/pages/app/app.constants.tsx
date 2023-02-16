import {
  AnalysisIcon,
  AppIcon,
  DatabaseIcon,
  DatabaseSettingIcon,
  NewsIcon,
  OrganizationIcon,
  ReportIcon,
  SettingIcon,
  SocialIcon,
} from "@/assets/svg";
import {
  appPath,
  configPath,
  databasePath,
  newsPath,
  organizationPath,
  pipelineInformationGathering,
  reportPath,
  socialPath,
  sourceConfigPath,
} from "@/pages/router";

export const DEFAULT_ENTITY_EXPLORER_WIDTH = 270;
export const DEFAULT_ENTITY_EXPLORER_PINNED = false;
export const DEFAULT_ENTITY_EXPLORER_ACTIVE = false;

export const NAVBAR_HEADER = [
  {
    title: "News",
    to: newsPath,
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
  {
    title: "Analysis",
    to: pipelineInformationGathering,
    icon: <AnalysisIcon />,
  },
  {
    title: "Database",
    to: databasePath,
    icon: <DatabaseIcon />,
  },
  {
    title: "Report",
    to: reportPath,
    icon: <ReportIcon />,
  },
  {
    title: "App",
    to: appPath,
    icon: <AppIcon />,
  },
  {
    title: "Configuration",
    to: configPath,
    icon: <SettingIcon />,
  },
  {
    title: "Database setting",
    to: sourceConfigPath,
    icon: <DatabaseSettingIcon />,
  },
];
