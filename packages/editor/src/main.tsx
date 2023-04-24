import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import "antd/dist/antd.css";
import React from "react";
import ReactDOM from "react-dom/client";

import { Editor } from "./editor";
import { EditorNodes } from "./nodes/editor-nodes";
import { editorTheme } from "./themes/editor-theme";

const initialConfig: InitialConfigType = {
  namespace: "synthetic-report",
  onError: (error) => {
    console.error(error);
    throw new Error("synthetic-report?");
  },
  theme: editorTheme,
  nodes: [...EditorNodes],
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LexicalComposer initialConfig={initialConfig}>
      <Editor />
    </LexicalComposer>
  </React.StrictMode>,
);
