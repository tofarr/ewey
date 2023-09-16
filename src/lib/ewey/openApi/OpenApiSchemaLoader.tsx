import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import OpenApiSchema from "./model/OpenApiSchema";
import ErrorComponent, {
  ErrorComponentProps,
} from "../component/ErrorComponent";
import AppLoadingComponent from "../component/AppLoadingComponent";

export interface OpenApiSchemaLoaderChildProps {
  schema: OpenApiSchema;
}

export interface OpenApiSchemaLoaderProps {
  url: string;
  children: FC<OpenApiSchemaLoaderChildProps>;
  loadingComponent?: FC;
  errorComponent?: FC<ErrorComponentProps>;
  refetchOnWindowFocus?: boolean;
}

export const sanitizeOpenApiSchema = (schema: OpenApiSchema, url: string) => {
  if (!schema.servers) {
    const apiUrl = new URL(url);
    apiUrl.pathname = apiUrl.search = "";
    schema.servers = [
      {
        url: apiUrl.toString(),
      },
    ];
  }
  for (const server of schema.servers) {
    const { url } = server;
    if (url.endsWith("/")) {
      server.url = url.substring(0, url.length - 1);
    }
  }
  return schema;
};

const OpenApiSchemaLoader: FC<OpenApiSchemaLoaderProps> = ({
  url,
  children,
  loadingComponent,
  errorComponent,
  refetchOnWindowFocus = false
}) => {
  if (!loadingComponent) {
    loadingComponent = AppLoadingComponent;
  }
  if (!errorComponent) {
    errorComponent = ErrorComponent;
  }
  const { error, data } = useQuery({
    queryKey: [url],
    queryFn: () => fetch(url).then((res) => res.json()),
    refetchOnWindowFocus,
  });

  if (error) {
    return (errorComponent as FC<ErrorComponentProps>)({});
  }
  if (data) {
    const sanitized = sanitizeOpenApiSchema(data, url);
    return children(sanitized);
  }
  return (loadingComponent as FC)({});
};

export default OpenApiSchemaLoader;
