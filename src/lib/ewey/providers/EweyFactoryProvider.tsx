import { createContext, FC, ReactElement, useContext } from "react";
import { FACTORIES } from "../eweyFactory";
import EweyFactory from "../eweyFactory/EweyFactory";

export const EweyFactoryContext = createContext<EweyFactory[]>(FACTORIES);

export interface EweyFactoryProviderProps {
  children: ReactElement | ReactElement[];
  factories: EweyFactory[];
}

export const EweyFactoryProvider: FC<EweyFactoryProviderProps> = ({
  children,
  factories,
}) => {
  return (
    <EweyFactoryContext.Provider value={factories}>
      {children}
    </EweyFactoryContext.Provider>
  );
};

export const useEweyFactories = () => {
  const factories = useContext(EweyFactoryContext)
  return factories;
}
