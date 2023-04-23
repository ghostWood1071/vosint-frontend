import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from "@lexical/react/LexicalDecoratorBlockNode";
import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from "lexical";

import { EventsComponent } from "./events-components";

function convertEventsElement(domNode: HTMLElement): DOMConversionOutput | null {
  const id = domNode.getAttribute("data-lexical-events-id");
  if (id) {
    const node = $createEventsNode(id);
    return { node };
  }
  return null;
}

export type SerializedEventsNode = Spread<
  {
    id: string;
    type: "events";
    version: 1;
  },
  SerializedDecoratorBlockNode
>;

export class EventsNode extends DecoratorBlockNode {
  __id: string;

  constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__id = id;
  }

  static getType(): string {
    return "events";
  }

  static clone(node: EventsNode): EventsNode {
    return new EventsNode(node.__id, node.__format, node.__key);
  }

  static importJSON(serializedNode: SerializedEventsNode): EventsNode {
    const node = $createEventsNode(serializedNode.id);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedEventsNode {
    return {
      ...super.exportJSON(),
      id: this.__id,
      type: "events",
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      div: (domNode: HTMLDivElement) => {
        if (!domNode.hasAttribute("data-lexical-events-id")) {
          return null;
        }
        return {
          conversion: convertEventsElement,
          priority: 2,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("div");
    element.setAttribute("data-lexical-events-id", this.__id);
    return { element };
  }

  getId() {
    return this.__id;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || "",
      focus: embedBlockTheme.focus || "",
    };

    return (
      <EventsComponent
        className={className}
        format={this.__format}
        nodeKey={this.__key}
        eventsId={this.__id}
      />
    );
  }
}

export function $createEventsNode(id: string): EventsNode {
  return new EventsNode(id);
}

export function $isEventsNode(node: LexicalNode): node is EventsNode {
  return node instanceof EventsNode;
}
