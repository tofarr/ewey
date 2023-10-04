import { FC } from "react";
import OpenApiContent from "./OpenApiContent";
import OpenApiQuery from "./OpenApiQuery";
import { ErrorComponentProps } from "../component/ErrorComponent";

export interface OpenApiQueryContentProps {
  operationId: string;
  params?: any;
  ResultsLoadingComponent?: FC;
  ResultsErrorComponent?: FC<ErrorComponentProps>;
  refetchOnMount?: boolean
}

const OpenApiQueryContent: FC<OpenApiQueryContentProps> = ({
  operationId,
  params,
  ResultsLoadingComponent,
  ResultsErrorComponent,
  refetchOnMount,
}) => {
  return (
    <OpenApiQuery
      operationId={operationId}
      params={params}
      ResultsLoadingComponent={ResultsLoadingComponent}
      ResultsErrorComponent={ResultsErrorComponent}
      refetchOnMount={refetchOnMount}
    >
      {(value) => (
        <OpenApiContent
          operationId={operationId}
          value={value}
        />
      )}
    </OpenApiQuery>
  )
};

export default OpenApiQueryContent;
