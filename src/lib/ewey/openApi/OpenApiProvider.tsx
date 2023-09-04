import { createContext, useContext } from "react";
import { FC, ReactElement } from "react";
import OpenApiSchema from "./model/OpenApiSchema";
import { OpenApi, createOpenApi } from "./model/OpenApi";
import OpenApiSchemaLoader from "./OpenApiSchemaLoader";
import { ErrorComponentProps } from "../component/ErrorComponent";

export const OpenApiContext = createContext<OpenApiSchema>(null);

export interface OpenApiProviderProps {
  url: string;
  children: ReactElement | ReactElement[];
  loadingComponent?: FC;
  errorComponent?: FC<ErrorComponentProps>;
}

const OpenApiProvider: FC<OpenApiProviderProps> = ({
  url,
  children,
  loadingComponent,
  errorComponent,
}) => {
  return (
    <OpenApiSchemaLoader
      url={url}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
    >
      {(schema) => (
        <OpenApiContext.Provider value={createOpenApi(schema)}>
          {children}
        </OpenApiContext.Provider>
      )}
    </OpenApiSchemaLoader>
  );
};

export default OpenApiProvider;

export const useOpenApi = () => {
  // Hack to force type checker to accept the type of the context
  const openApi: OpenApi = useContext(OpenApiContext);
  return openApi;
};
