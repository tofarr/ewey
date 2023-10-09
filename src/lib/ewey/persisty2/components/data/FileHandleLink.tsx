import { Link } from "react-router-dom"
import { useOpenApi } from "../../../openApi/OpenApiProvider"
import { JsonObjType, jsonObjToQueryStr } from "json-urley"


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
}


export default function FileHandleLink({fileHandle, storeName, width, height}: ResizedImgProps) {
  const openApi = useOpenApi()
  const isImg = (fileHandle.content_type || "").startsWith("image/")
  if (!width){
    width = 80
  }
  if (!height){
    height = 60
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
    const src = `${openApi.baseUrl}/resized-img?${jsonObjToQueryStr(params)}`
    return src
  }

  if (isImg) {
    return (
      <img src={renderSrc()} style={{width: width+"px", height: height + "px"}} />
    )
  }

  return (
    <Link target="_blank" to={fileHandle.download_url}>
      {fileHandle.file_name as string}
    </Link>
  )
}