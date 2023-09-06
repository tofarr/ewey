import { ReactElement, createContext, useContext } from "react";

export interface AutoFocusProviderProps {
  autoFocusPath: string[];
  children: ReactElement | ReactElement[];
}

export const AutoFocusContext = createContext<string[] | null>(null);

const AutoFocusProvider = ({ autoFocusPath, children }: AutoFocusProviderProps) => {
  return (
    <AutoFocusContext.Provider value={autoFocusPath}>
      {children}
    </AutoFocusContext.Provider>
  );
};

export function useAutoFocusPath() {
  const autoFocusPath = useContext(AutoFocusContext);
  return autoFocusPath;
};

export function useIsAutoFocused(path?: string[] | null){
  const autoFocusPath = useContext(AutoFocusContext);
  if (!path || !autoFocusPath) {
    return false
  }
  const result = path.length === autoFocusPath.length && path.every((v, i) => v === autoFocusPath[i]);
  return result
}

export default AutoFocusProvider;
