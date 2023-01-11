import {
  ActionGotoIcon,
  ActionKeyboardPressIcon,
  ActionGetContentIcon,
  ActionWhileIcon,
  ActionClick,
  ActionScrollIcon,
  ActionAttributeIcon,
  ActionForIcon,
  ActionGetNewInformationIcon,
  ActionGetUrlsIcon,
  ActionSelectIcon,
  ActionUrlInputIcon,
} from "@/assets/svg";
import { TreeItems } from "./pipeline.types";

export const PIPELINE_ACTION_ICON: Record<string, JSX.Element> = {
  goto: <ActionGotoIcon />,
  keyboard_press: <ActionKeyboardPressIcon />,
  get_content: <ActionGetContentIcon />,
  while: <ActionWhileIcon />,
  click: <ActionClick />,
  scroll: <ActionScrollIcon />,
  get_attr: <ActionAttributeIcon />,
  foreach: <ActionForIcon />,
  url_input: <ActionUrlInputIcon />,
  select: <ActionSelectIcon />,
  get_urls: <ActionGetUrlsIcon />,
  get_news_info: <ActionGetNewInformationIcon />,
};

export const DEFAULT_INIT_PIPELINE: TreeItems = [{ id: "goto-temp", name: "goto", params: {} }];
