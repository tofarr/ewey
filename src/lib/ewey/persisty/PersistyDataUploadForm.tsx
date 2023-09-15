import { ChangeEvent, FormEvent, useState } from "react";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { OpenApiOperation } from "../openApi/model/OpenApiOperation";
import { getLabel } from "../label";
import { headersFromToken } from "../openApi/headers";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";
import { useMessageBroker } from "../message/MessageBrokerContext";
import { JsonObjectType } from "../eweyField/JsonType";
import SubmitComponent from "../component/SubmitComponent";
import { useOpenApi } from "../openApi/OpenApiProvider";
import ImgPreviewComponent from "../component/ImgPreviewComponent";
import Box from "@mui/material/Box";


export interface PersistyDataUploadFormProps {
  store: string
  initialValues?: JsonObjectType
  getUploadFormOperation: OpenApiOperation
  onUpload?: (item: JsonObjectType) => void
}

export interface FormField {
  name: string
  value: string
}

export interface UploadForm {
  url: string
  pre_populated_fields?: FormField[] | null
  file_param: string
  expire_at?: string | null
  content_types: string[] | null
}

export function PersistyDataUploadForm({ store, getUploadFormOperation, onUpload }: PersistyDataUploadFormProps) {
  const { t } = useTranslation();
  const token = useOAuthBearerToken()
  const headers = headersFromToken(token?.token);
  const queryClient = useQueryClient()
  const messageBroker = useMessageBroker();
  const openApi = useOpenApi()
  const [file, setFile] = useState<File|null>(null)
  const searchOperationName = `${store}_search`
  
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      if (!file){
        return  // illegal state
      }
      let key = uuidv4()
      if (file.type) {
        key += '.'+file.type.split('/')[1]
      }
      const result = await getUploadFormOperation.invoke({ key }, headers) as unknown as UploadForm;
      if (result) {
        const formData = new FormData()
        for (const prePopulatedField of (result.pre_populated_fields || [])) {
          formData.append(prePopulatedField.name, prePopulatedField.value)
        }
        formData.append(result.file_param, file)
        
        let url = result.url
        if (!url.startsWith("http:") && !url.startsWith("https:")){
          url = openApi.schema.servers[0].url + url
        }
        const uploadResponse = await fetch(url, {
          method: "POST",
          body: formData
        })
        const uploadResult = await uploadResponse.json()

        queryClient.invalidateQueries([searchOperationName], { exact: false });
        messageBroker.triggerMessage(getLabel('item_uploaded', t))
        if (onUpload) {
          onUpload(uploadResult)
        }
      } else {
        messageBroker.triggerError(getLabel('upload_failed', t))
      }
    },
  });
  const valid = !!file
  const isImg = (file?.type || '').toLowerCase().startsWith('image/')
  const component = store.split("_").map(v => v[0].toUpperCase()+v.substring(1)).join("")
  let content_types = getUploadFormOperation.paramsSchema.components[component].properties.content_type.enum
  if (content_types && content_types.length) {
      content_types = content_types.join(", ")
  } else {
      content_types = undefined
  }

  function handleChangeFile(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target
    const file = (files && files[0]) || null
    setFile(file)
  }

  function handleSubmit(event: FormEvent) {
      event.preventDefault()
      mutate()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button variant="outlined" component="label" fullWidth>
        {file?.name || getLabel("select_file", t)}
        <input hidden type="file" accept={content_types} onChange={handleChangeFile} />
      </Button>
      {file && isImg && (
        <Box pt={1} pb={1} display="flex" justifyContent="center">
          <ImgPreviewComponent file={file} maxWidth={552} maxHeight={400} />
        </Box>
      )}
      <Box display="flex" justifyContent="flex-end" pt={2}>
        <SubmitComponent
          submitting={!!isLoading}
          valid={valid}
          onSubmit={() => mutate()}
        />
      </Box>
    </form>
  )
}
