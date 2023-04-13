import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";

import "./content-editable.css";

interface Props {
  className?: string;
}

export function ContentEditable({ className }: Props): JSX.Element {
  return <LexicalContentEditable className={className || "content_editable__root"} />;
}
