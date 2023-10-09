import { Box, Button, Typography } from "@mui/material";
import SubmitComponent from "../../../component/SubmitComponent";
import { useTranslation } from "react-i18next";
import { useOAuthBearerToken } from "../../../oauth/OAuthBearerTokenProvider";
import { headersFromToken } from "../../../openApi/headers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessageBroker } from "../../../message/MessageBrokerContext";
import { ChangeEvent, FormEvent, useState } from "react";
import usePersistyDataOperations from "../../PersistyDataOperationsProvider";
import { getLabel } from "../../../label";
import ImgPreviewComponent from "../../../component/ImgPreviewComponent";
import HeightAnimator from "../../../component/HeightAnimator";
import { OpenApiOperation } from "../../../openApi/model/OpenApiOperation";

export interface FileUploadFormProps {
  onFinishUpload?: (fileName: string, contentType: string | null) => void
}

// Currently these data structures leave a lot out that would allow for much larger uploads.

interface UploadPart{
  upload_url: string
}

interface UploadPartResultSet{
  results: UploadPart[]
}

interface Upload {
  id: string
  content_type: string | null
  file_name: string
  parts: UploadPartResultSet
}

export default function FileUploadForm({ onFinishUpload }: FileUploadFormProps) {
  const { t } = useTranslation();
  const token = useOAuthBearerToken()
  const headers = headersFromToken(token?.token);
  const queryClient = useQueryClient()
  const messageBroker = useMessageBroker();
  const [file, setFile] = useState<File|null>(null)
  const { fileSearchOp, uploadCreateOp, uploadFinishOp, fileSchema, baseUrl } = usePersistyDataOperations()
  
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      if (!file){
        return  // illegal state
      }
      const upload = await (uploadCreateOp as OpenApiOperation).invoke({content_type: file.type, size_in_bytes: file.size}, headers) as unknown as Upload
      const { maxPartSize} = fileSchema.persistyData
      await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend =  async function(event){
          try{
            if (event?.target?.readyState == FileReader.DONE) {
              const fileContent = event.target.result as ArrayBuffer
              let offset = 0
              let partIndex = 0
              while (offset < file.size){
                const part = upload.parts.results[partIndex++]
                const partSize = Math.min(maxPartSize, file.size - offset)
                let uploadUrl = part.upload_url
                if (!uploadUrl.startsWith("http")) {
                  uploadUrl = baseUrl + uploadUrl
                }
                await fetch(uploadUrl, {
                  method: "POST",
                  body: fileContent.slice(offset, offset + partSize),
                  headers
                })
                offset += partSize
              }
              resolve(null)
            }
          }
          catch(e){
            reject(e)
          }
        }
        reader.readAsArrayBuffer(file)  
      });
      await uploadFinishOp?.invoke({upload_id: upload.id}, headers)
      queryClient.invalidateQueries([fileSearchOp?.operationId], {exact: false})
      if (onFinishUpload){
        onFinishUpload(upload.file_name, upload.content_type)
      }
    },
  });

  const valid = !!file
  const isImg = (file?.type || '').toLowerCase().startsWith('image/')
  let content_types = fileSchema.properties.content_types?.enum;

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
      <Box pb={1}>
        <Typography variant="h4">{getLabel("select_file", t)}</Typography>  
      </Box>
      <Button variant="outlined" component="label" fullWidth>
        {file?.name || getLabel("select_file", t)}
        <input hidden type="file" accept={content_types} onChange={handleChangeFile} />
      </Button>
      <HeightAnimator>
        <Box>
          {file && isImg && (
            <Box pt={1} pb={1} display="flex" justifyContent="center">
              <ImgPreviewComponent file={file} maxWidth={552} maxHeight={400} />
            </Box>
          )}
        </Box>
      </HeightAnimator>
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