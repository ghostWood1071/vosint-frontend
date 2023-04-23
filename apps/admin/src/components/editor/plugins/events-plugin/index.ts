import { useLexicalComposerContext } from "@aiacademy/editor";
import { useEffect } from "react";

import { EventsNode } from "./events-node";

export default function EventsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EventsNode])) {
      throw new Error("EventsPlugin: EventsNode not registered on editor");
    }
  }, [editor]);

  return null;
}
