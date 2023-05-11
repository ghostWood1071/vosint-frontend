import React, { createContext } from "react";

type HeadingTocContextType = {
  mode: "create" | "update" | "delete" | null;
  selectedIndex: number | null;
};

const HeadingTocContext = createContext<HeadingTocContextType>({
  mode: null,
  selectedIndex: null,
});

const HeadingTocDispatchContext = createContext<{
  setMode: React.Dispatch<React.SetStateAction<"create" | "update" | "delete" | null>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
}>({
  setMode: () => {},
  setSelectedIndex: () => {},
});

export const HeadingTocProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = React.useState<"create" | "update" | "delete" | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  return (
    <HeadingTocContext.Provider value={{ mode, selectedIndex }}>
      <HeadingTocDispatchContext.Provider value={{ setMode, setSelectedIndex }}>
        {children}
      </HeadingTocDispatchContext.Provider>
    </HeadingTocContext.Provider>
  );
};

export const useHeadingTocContext = () => React.useContext(HeadingTocContext);
export const useHeadingTocDispatchContext = () => React.useContext(HeadingTocDispatchContext);
