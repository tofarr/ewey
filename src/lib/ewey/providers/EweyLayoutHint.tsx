import { createContext, FC, ReactElement, useContext } from "react";


export enum EweyLayoutHint {
  LABELS_ALWAYS_ABOVE = 'labelsAlwaysAbove'
}

export const EweyLayoutHintContext = createContext<EweyLayoutHint | null>(null);

export interface EweyLayoutHintProviderProps {
  children: ReactElement | ReactElement[];
  hint?: EweyLayoutHint | null;
}

export const EweyLayoutHintProvider: FC<EweyLayoutHintProviderProps> = ({
  children,
  hint,
}) => {
  return (
    <EweyLayoutHintContext.Provider value={hint || null}>
      {children}
    </EweyLayoutHintContext.Provider>
  );
};

export const useEweyLayoutHint = () => {
  const hint = useContext(EweyLayoutHintContext)
  return hint;
}
