import { useLexicalComposerContext } from "@aiacademy/editor";
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from "@lexical/react/LexicalDecoratorBlockNode";
import { DatePicker } from "antd";
import {
  $getNodeByKey,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from "lexical";
import moment from "moment";
import { useEffect } from "react";

import { FILTER_EVENT } from ".";

export type EventFilterPayload = {
  startDate: string;
  endDate: string;
};

type SerializedEventFilterNode = Spread<
  {
    startDate: string;
    endDate: string;
    type: "event-filter";
    version: 1;
  },
  SerializedDecoratorBlockNode
>;

export function convertEventFilterElement(domNode: HTMLDivElement): DOMConversionOutput | null {
  const startDate = domNode.getAttribute("data-event-filter-start-date");
  const endDate = domNode.getAttribute("data-event-filter-end-date");
  if (startDate && endDate) {
    const node = $createEventFilterNode({ startDate, endDate });
    return { node };
  }
  return null;
}

export class EventFilterNode extends DecoratorBlockNode {
  __startDate: string;
  __endDate: string;

  constructor(startDate: string, endDate: string, key?: string) {
    super("center", key);
    this.__startDate = startDate;
    this.__endDate = endDate;
  }

  static getType(): string {
    return "event-filter";
  }

  static clone(node: EventFilterNode): EventFilterNode {
    return new EventFilterNode(node.__startDate, node.__endDate, node.key);
  }

  static importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      div: (domNode: HTMLDivElement) => {
        if (
          !domNode.hasAttribute("data-event-filter-start-date") &&
          !domNode.hasAttribute("data-event-filter-end-date")
        ) {
          return null;
        }

        return {
          conversion: convertEventFilterElement,
          priority: 1,
        };
      },
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement("div");
    element.setAttribute("data-event-filter-start-date", this.__startDate);
    element.setAttribute("data-event-filter-end-date", this.__endDate);
    return { element };
  }

  static importJSON(serializedNode: SerializedEventFilterNode): EventFilterNode {
    const { startDate, endDate } = serializedNode;
    const node = $createEventFilterNode({ startDate, endDate });
    node.setFormat("center");
    return node;
  }

  exportJSON(): SerializedEventFilterNode {
    return {
      ...super.exportJSON(),
      startDate: this.__startDate,
      endDate: this.__endDate,
      type: "event-filter",
      version: 1,
    };
  }

  setDate(startDate: string, endDate: string) {
    const writable = this.getWritable();
    writable.__startDate = startDate;
    writable.__endDate = endDate;
  }

  decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || "",
      focus: embedBlockTheme.focus || "",
    };

    return (
      <EventFilterComponent
        className={className}
        nodeKey={this.getKey()}
        startDate={this.__startDate}
        endDate={this.__endDate}
      />
    );
  }

  isInline(): boolean {
    return false;
  }
}

function EventFilterComponent({
  className,
  nodeKey,
  startDate,
  endDate,
}: {
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  nodeKey: NodeKey;
  startDate: string;
  endDate: string;
}) {
  const [editor] = useLexicalComposerContext();
  const defaultStartDate = moment(startDate, "DD/MM/YYYY");
  const defaultEndDate = moment(endDate, "DD/MM/YYYY");

  useEffect(() => {
    editor.dispatchCommand(FILTER_EVENT, {
      startDate: startDate,
      endDate: endDate,
    });
  }, [startDate, endDate, editor]);

  const handleChange = (_: any, values: [string, string]) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (!node) return;
      if (!$isEventFilterNode(node)) return;

      node.setDate(values[0], values[1]);
    });
  };

  return (
    <BlockWithAlignableContents className={className} nodeKey={nodeKey} format={"center"}>
      <DatePicker.RangePicker
        defaultValue={[defaultStartDate, defaultEndDate]}
        bordered={false}
        onChange={handleChange}
      />
    </BlockWithAlignableContents>
  );
}

export function $createEventFilterNode(payload: EventFilterPayload): EventFilterNode {
  return new EventFilterNode(payload.startDate, payload.endDate);
}

export function $isEventFilterNode(node: LexicalNode): node is EventFilterNode {
  return node instanceof EventFilterNode;
}
