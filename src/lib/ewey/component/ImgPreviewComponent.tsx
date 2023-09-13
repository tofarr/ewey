import { useEffect } from "react"

export interface ImgPreviewComponentProps {
  file: File
  maxWidth?: number
  maxHeight?: number
}

const ImgPreviewComponent = ({ file, maxWidth, maxHeight }: ImgPreviewComponentProps) => {
  const objectUrl = URL.createObjectURL(file);
  return (
    <img src={objectUrl} style={{maxWidth, maxHeight}} />
  )
}

export default ImgPreviewComponent
