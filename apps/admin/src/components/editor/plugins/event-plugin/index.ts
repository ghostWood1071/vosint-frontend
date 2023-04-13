import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode } from "@lexical/rich-text";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getRoot,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  Klass,
  LexicalCommand,
  LexicalNode,
  createCommand,
} from "lexical";
import moment from "moment";
import { useEffect } from "react";

import { EventEditorConfig, useEventContext } from "./event-context";
import { $createEventFilterNode, EventFilterNode, EventFilterPayload } from "./event-filter-node";
import { $createEventNode, $isEventNode, EventNode, EventPayload } from "./event-node";

export const INSERT_EVENT_COMMAND: LexicalCommand<EventPayload> =
  createCommand("INSERT_EVENT_COMMAND");
export const INSERT_EVENT_FILTER_COMMAND: LexicalCommand<EventFilterPayload> = createCommand(
  "INSERT_EVENT_FILTER_COMMAND",
);

export const SET_OPEN_ALL_EVENT_COMMAND = createCommand<boolean>("SET_OPEN_ALL_EVENT_COMMAND");
export const FILTER_EVENT: LexicalCommand<EventFilterPayload> = createCommand("FILTER_EVENT");

export function EventPlugin({
  eventEditorConfig,
  children,
}: {
  eventEditorConfig: EventEditorConfig;
  children: JSX.Element | Array<JSX.Element>;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const eventContext = useEventContext();

  useEffect(() => {
    if (!editor.hasNodes([EventNode, EventFilterNode])) {
      throw new Error("EventPlugin: EventNode, EventFilterNode not registered on editor");
    }

    eventContext.set(eventEditorConfig, children);

    return mergeRegister(
      editor.registerCommand<EventPayload>(
        INSERT_EVENT_COMMAND,
        (payload) => {
          const eventNode = $createEventNode(payload);
          $insertNodes([eventNode]);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        SET_OPEN_ALL_EVENT_COMMAND,
        (payload) => {
          editor.update(() => {
            const root = $getRoot();
            const rootChildren = root.getChildren();
            for (const child of rootChildren) {
              if ($isEventNode(child)) {
                child.toggleHidden();
              }
            }
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<EventFilterPayload>(
        INSERT_EVENT_FILTER_COMMAND,
        (payload) => {
          const eventFilterNode = $createEventFilterNode(payload);
          $insertNodes([eventFilterNode]);
          if ($isRootOrShadowRoot(eventFilterNode.getParentOrThrow())) {
            $wrapNodeInElement(eventFilterNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<EventFilterPayload>(
        FILTER_EVENT,
        (payload) => {
          const root = $getRoot();
          const rootChildren = root.getChildren();
          for (const child of rootChildren) {
            if (!$isEventNode(child)) continue;
            if (payload.endDate === "" || payload.startDate === "") {
              child.setHidden(false);
              continue;
            }

            const isBetween = moment(child.getDate()).isBetween(
              payload.startDate,
              payload.endDate,
              null,
              "[]",
            );

            isBetween ? child.setHidden(false) : child.setHidden(true);
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [eventContext, eventEditorConfig, children, editor]);

  return null;
}

export const EventNodes: Array<Klass<LexicalNode>> = [HeadingNode];
