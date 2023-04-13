import { EditorNodes } from "@/nodes/editor-nodes";
import { editorTheme } from "@/themes/editor-theme";
import { ContentEditable } from "@/ui/content-editable";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import {
  LexicalComposerContext,
  createLexicalComposerContext,
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";

import { Editor } from "./editor";
import { FloatingTextFormatToolbar } from "./plugins";

export {
  Editor,
  ContentEditable,
  LexicalComposer,
  LexicalNestedComposer,
  LexicalComposerContext,
  useLexicalComposerContext,
  createLexicalComposerContext,
  EditorNodes,
  editorTheme,
  FloatingTextFormatToolbar,
};
