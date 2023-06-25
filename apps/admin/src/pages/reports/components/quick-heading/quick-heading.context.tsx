import React, { createContext } from "react";

type QuickHeadingContextType = {
  mode: "create" | "update" | "delete" | null;
  currentHeading: number | null;
  selectedIndex: number | null;
};

const QuickHeadingContext = createContext<QuickHeadingContextType>({
  mode: null,
  selectedIndex: null,
  currentHeading: null,
});

const QuickHeadingDispatchContext = createContext<{
  setMode: React.Dispatch<React.SetStateAction<"create" | "update" | "delete" | null>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentHeading: React.Dispatch<React.SetStateAction<number | null>>;
}>({
  setMode: () => {},
  setSelectedIndex: () => {},
  setCurrentHeading: () => {},
});

export const QuickHeadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = React.useState<"create" | "update" | "delete" | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [currentHeading, setCurrentHeading] = React.useState<number | null>(null);

  return (
    <QuickHeadingContext.Provider value={{ mode, selectedIndex, currentHeading }}>
      <QuickHeadingDispatchContext.Provider
        value={{ setMode, setSelectedIndex, setCurrentHeading }}
      >
        {children}
      </QuickHeadingDispatchContext.Provider>
    </QuickHeadingContext.Provider>
  );
};

export const useQuickHeadingContext = () => React.useContext(QuickHeadingContext);
export const useQuickHeadingDispatchContext = () => React.useContext(QuickHeadingDispatchContext);
