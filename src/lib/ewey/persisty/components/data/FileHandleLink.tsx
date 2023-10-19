import { Link } from "react-router-dom"
import ErrorIcon from "@mui/icons-material/Error";
import { useOpenApi } from "../../../openApi/OpenApiProvider"
import { JsonObjType, jsonObjToQueryStr } from "json-urley"
import Button from "@mui/material/Button"
import { useState } from "react"


export interface FileHandle {
  file_name: string
  content_type?: string
  download_url: string
}


export interface ResizedImgProps{
  fileHandle: FileHandle
  storeName: string
  width?: number
  height?: number
  onClick?: (fileHandle: FileHandle) => void
  isValid?: boolean
}

enum Status {
  READY = 1,
  ERROR = 2,
  RETRYING = 3,
}


export default function FileHandleLink({fileHandle, storeName, width, height, onClick, isValid}: ResizedImgProps) {
  const openApi = useOpenApi()
  const [status, setStatus] = useState(Status.READY)
  const isImg = (fileHandle.content_type || "").startsWith("image/")
  if (!width){
    width = 80
  }
  if (!height){
    height = 60
  }
  if (isValid == null){
    isValid = true
  }

  function renderSrc(){
    const noResize = !openApi.operations.find(op => op.operationId === "resized_img_url")
    if (noResize){
      let src = fileHandle.download_url
      if (!src.startsWith("http")) {
        src = openApi.baseUrl + src
      }
      return src
    }
    const params = {
      store_name: storeName,
      file_name: fileHandle.file_name,
      content_type: fileHandle.content_type,
      width,
      height
    } as unknown as JsonObjType
    if (status === Status.RETRYING){
      params.nonce = new Date().getTime()
    }
    const src = `${openApi.baseUrl}/resized-img?${jsonObjToQueryStr(params)}`
    return src
  }

  function handleError(event: any){
    if (status === Status.READY) {
      setStatus(Status.RETRYING)
    }else{
      setStatus(Status.ERROR)
    }
  }

  function renderContent(){
    if (isImg) {
      if (status === Status.ERROR){
        return <ErrorIcon />
      }
      return (
        <img alt="" src={renderSrc()} style={{width: width+"px", height: height + "px"}} onError={handleError} />
      )
    }
    return fileHandle.file_name as string
  }

  if (onClick){
    return (
      <Button variant="outlined" color={isValid ? "primary" : "error"} onClick={() => onClick(fileHandle)} >
        {renderContent()}
      </Button>
    )
  }

  return (
    <Link to={openApi.baseUrl + fileHandle.download_url}>
      <Button variant="outlined" color={isValid ? "primary" : "error" }>
        {renderContent()}
      </Button>
    </Link>
  )
}