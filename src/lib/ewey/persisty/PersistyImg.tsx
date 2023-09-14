import { useEffect, useRef, useState } from "react"
import ErrorIcon from '@mui/icons-material/Error';
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress";


export interface PersistyImgProps {
  src: string
  updatedAt?: string | null
  width?: number
  height?: number
  maxWidth?: number
  maxHeight?: number
}

enum Status {
  LOADING,
  WAITING,
  READY,
  ERROR
}

const PersistyImg = ({src, updatedAt, width, height, maxWidth, maxHeight}: PersistyImgProps) => {
  // Due to the fact that some data stores are eventually consistent, images can take a few seconds
  // to appear in the UI. This allows for easy reloading if this is the case - we display a loading
  // indicator in the event of errors for the first 30 seconds
  const [status, setStatus] = useState(Status.LOADING)
  const retryHandle = useRef<any>()

  useEffect(() => {
    if (status === Status.WAITING && !retryHandle.current){
      retryHandle.current = setTimeout(() => {
        setStatus(Status.LOADING)
      }, 5000)
    } else if (retryHandle.current) {
      clearTimeout(retryHandle.current)
      retryHandle.current = null
    }
    return () => {
      clearTimeout(retryHandle.current)
      retryHandle.current = null
    }
  }, [status, retryHandle])

  function handleError(){
    if (updatedAt){
      const updatedAtTime = new Date(updatedAt).getTime();
      const nowTime = new Date().getTime();
      if (updatedAtTime + 1020000 > nowTime){
        setStatus(Status.WAITING)
        return
      }
    }
    setStatus(Status.ERROR)
  }

  if (status === Status.ERROR) {
    return (
      <Button variant="outlined" color="error" style={{width, height}} onClick={() => setStatus(Status.LOADING)}>
        <ErrorIcon />
      </Button>
    )
  }

  if (status === Status.WAITING) {
    return (
      <Button variant="outlined" style={{width, height}} onClick={() => setStatus(Status.LOADING)}>
        <CircularProgress size={24} />
      </Button>
    )
  }

  return <img src={src} style={{width, height, maxWidth, maxHeight}} onError={handleError} alt="" />
}

export default PersistyImg
