import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  DecoratorNode,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import moment from "moment";
import { Suspense, lazy } from "react";

import styles from "./index.module.less";

const EventComponent = lazy(() => import("./event-component"));

export type EventPayload = {
  id: string;
  open: boolean;
  hidden: boolean;
  title?: string;
  description?: string;
  date?: string;
};

type SerializedEventNode = Spread<
  {
    id: string;
    open: boolean;
    hidden: boolean;
    date?: string;
    type: "event";
    version: 1;
  },
  SerializedLexicalNode
>;

export function convertEventElement(domNode: HTMLDetailsElement): DOMConversionOutput | null {
  const isOpen = domNode.open !== undefined ? domNode.open : true;
  const isHidden = domNode.hidden !== undefined ? domNode.hidden : false;
  const id = domNode.getAttribute("data-id");
  if (id) {
    const node = $createEventNode({ open: isOpen, id, hidden: isHidden });
    return { node };
  }
  return null;
}

export class EventNode extends DecoratorNode<JSX.Element> {
  __id: string;
  __open: boolean;
  __date: string;
  __hide: boolean;

  constructor(open: boolean, id: string, hide?: boolean, date?: string, key?: string) {
    super(key);
    this.__id = id;
    this.__open = open;
    this.__hide = hide || false;
    this.__date = date || moment().format("DD/MM/YYYY");
  }

  static getType(): string {
    return "event";
  }

  static clone(node: EventNode): EventNode {
    return new EventNode(node.__open, node.__id, node.__hide, node.__date, node.__key);
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLDetailsElement {
    const dom = document.createElement("details");
    dom.classList.add(styles.container);
    dom.open = this.__open;
    dom.hidden = this.__hide;
    dom.setAttribute("data-date", this.__date);
    dom.onclick = () => false;

    return dom;
  }

  updateDOM(prevNode: EventNode, dom: HTMLDetailsElement): boolean {
    if (this.__open !== prevNode.__open) {
      dom.open = this.__open;
    }

    if (this.__hide !== prevNode.__hide) {
      dom.hidden = this.__hide;
    }

    return false;
  }

  static importDOM(): DOMConversionMap<HTMLDetailsElement> | null {
    return {
      details: (domNode: HTMLDetailsElement) => {
        if (!domNode.hasAttribute("data-id")) {
          return null;
        }

        return {
          conversion: convertEventElement,
          priority: 1,
        };
      },
    };
  }

  exportDOM(_editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement("details");
    element.setAttribute("data-id", this.__id);
    element.setAttribute("hidden", this.__hide.toString());
    element.setAttribute("date", this.__date);
    element.classList.add(styles.container);
    return { element };
  }

  static importJSON(serializedNode: SerializedEventNode): EventNode {
    const { id, open, hidden } = serializedNode;
    return $createEventNode({ id, open, hidden });
  }

  exportJSON(): SerializedEventNode {
    return {
      id: this.__id,
      open: this.__open,
      hidden: this.__hide,
      date: this.__date,
      type: "event",
      version: 1,
    };
  }

  getOpen(): boolean {
    return this.__open;
  }

  setOpen(open: boolean): void {
    const writable = this.getWritable();
    writable.__open = open;
  }

  toggleOpen(): void {
    this.setOpen(!this.getOpen());
  }

  getID(): string {
    return this.__id;
  }

  getHidden(): boolean {
    return this.__hide;
  }

  setHidden(hidden: boolean): void {
    const writable = this.getWritable();
    writable.__hide = hidden;
  }

  toggleHidden(): void {
    this.setHidden(!this.getHidden());
  }

  getDate(): string {
    return this.getLatest().__date;
  }

  setDate(date: string): void {
    const writable = this.getWritable();
    writable.__date = date;
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): JSX.Element {
    const date = moment(this.getDate());

    return (
      <Suspense fallback={null}>
        <EventComponent id={this.getID()} nodeKey={this.getKey()} date={date} />
      </Suspense>
    );
  }

  isInline(): boolean {
    return false;
  }

  isIsolated(): boolean {
    return true;
  }
}

export function $createEventNode({ open, id, hidden, date }: EventPayload): EventNode {
  return new EventNode(open, id, hidden, date);
}

export function $isEventNode(node: LexicalNode): node is EventNode {
  return node instanceof EventNode;
}
