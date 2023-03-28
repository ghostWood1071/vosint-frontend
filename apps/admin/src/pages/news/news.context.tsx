import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

const NewsFilterContext = createContext<Record<string, any>>({});
const NewsFilterDispatchContext = createContext<Dispatch<SetStateAction<any>>>(() => ({}));

interface Props {
  children: React.ReactElement;
}

export function NewsFilterProvider({ children }: Props) {
  const [state, setState] = useState<Record<string, any>>({});

  return (
    <NewsFilterContext.Provider value={state}>
      <NewsFilterDispatchContext.Provider value={setState}>
        {children}
      </NewsFilterDispatchContext.Provider>
    </NewsFilterContext.Provider>
  );
}

export function useNewsFilter() {
  return useContext(NewsFilterContext);
}

export function useNewsFilterDispatch() {
  return useContext(NewsFilterDispatchContext);
}
