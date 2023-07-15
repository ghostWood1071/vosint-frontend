import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

const NewsFilterContext = createContext<Record<string, any>>({});
const NewsFilterDispatchContext = createContext<Dispatch<SetStateAction<any>>>(() => ({}));

interface Props {
  children: React.ReactElement;
}

export function NewsFilterProvider({ children }: Props) {
  const [filter, setFilter] = useState<Record<string, any>>({});

  return (
    <NewsFilterContext.Provider value={filter}>
      <NewsFilterDispatchContext.Provider value={setFilter}>
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
