import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import type { Klass, LexicalNode } from "lexical";

export const EditorNodes: Array<Klass<LexicalNode>> = [HeadingNode, QuoteNode];
