import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import OpenApiSchema from "./model/OpenApiSchema";
import ErrorComponent, {
  ErrorComponentProperties,
} from "../component/ErrorComponent";
import LoadingComponent from "../component/LoadingComponent";

export interface OpenApiSchemaLoaderChildProperties {
  schema: OpenApiSchema;
}

export interface OpenApiSchemaLoaderProperties {
  url: string;
  children: FC<OpenApiSchemaLoaderChildProperties>;
  loadingComponent?: FC;
  errorComponent?: FC<ErrorComponentProperties>;
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

const OpenApiSchemaLoader: FC<OpenApiSchemaLoaderProperties> = ({
  url,
  children,
  loadingComponent,
  errorComponent,
}) => {
  if (!loadingComponent) {
    loadingComponent = LoadingComponent;
  }
  if (!errorComponent) {
    errorComponent = ErrorComponent;
  }
  const { error, data } = useQuery({
    queryKey: [url],
    queryFn: () => fetch(url).then((res) => res.json()),
  });

  if (error) {
    return (errorComponent as FC<ErrorComponentProperties>)({});
  }
  if (data) {
    const sanitized = sanitizeOpenApiSchema(data, url);
    return children(sanitized);
  }
  return (loadingComponent as FC)({});
};

export default OpenApiSchemaLoader;
