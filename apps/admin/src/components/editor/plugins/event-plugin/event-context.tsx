import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { EditorThemeClasses, Klass, LexicalEditor, LexicalNode } from "lexical";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";

export type EventEditorConfig = Readonly<{
  namespace: string;
  nodes?: ReadonlyArray<Klass<LexicalNode>>;
  onError: (error: Error, editor: LexicalEditor) => void;
  readonly?: boolean;
  theme?: EditorThemeClasses;
}>;

export type EventContextShape = {
  eventEditorConfig: null | EventEditorConfig;
  eventEditorPlugins: null | JSX.Element | Array<JSX.Element>;
  set: (
    eventEditorConfig: null | EventEditorConfig,
    eventEditorPlugins: null | JSX.Element | Array<JSX.Element>,
  ) => void;
};

const EventContext = createContext<EventContextShape>({
  eventEditorConfig: null,
  eventEditorPlugins: null,
  set: () => {},
});

export function EventProvider({ children }: { children: ReactNode }) {
  const [contextValue, setContextValue] = useState<{
    eventEditorConfig: null | EventEditorConfig;
    eventEditorPlugins: null | JSX.Element | Array<JSX.Element>;
  }>({
    eventEditorConfig: null,
    eventEditorPlugins: null,
  });

  return (
    <EventContext.Provider
      value={useMemo(
        () => ({
          eventEditorConfig: contextValue.eventEditorConfig,
          eventEditorPlugins: contextValue.eventEditorPlugins,
          set: (eventEditorConfig, eventEditorPlugins) => {
            setContextValue({
              eventEditorConfig,
              eventEditorPlugins,
            });
          },
        }),
        [contextValue.eventEditorConfig, contextValue.eventEditorPlugins],
      )}
    >
      {children}
    </EventContext.Provider>
  );
}

export function EventEditor({ eventEditor }: { eventEditor: LexicalEditor }) {
  const { eventEditorConfig, eventEditorPlugins } = useContext(EventContext);

  if (eventEditorConfig === null || eventEditorPlugins === null) {
    return null;
  }

  return (
    <LexicalNestedComposer
      initialEditor={eventEditor}
      initialTheme={eventEditorConfig.theme}
      initialNodes={eventEditorConfig.nodes}
      skipCollabChecks={true}
    >
      {eventEditorPlugins}
    </LexicalNestedComposer>
  );
}

export function useEventContext() {
  try {
    return useContext(EventContext);
  } catch (error) {
    throw new Error(
      "useEventContext must be used within a EventProvider. Wrap a parent component in <EventProvider> to fix this error.",
    );
  }
}
