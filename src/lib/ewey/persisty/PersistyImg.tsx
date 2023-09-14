import { useState } from "react"
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from "@mui/material/Button"


export interface PersistyImgProps {
  src: string
  width?: number
  height?: number
  maxWidth?: number
  maxHeight?: number
}

const PersistyImg = (props: PersistyImgProps) => {
  // Due to the fact that some data stores are eventually consistent, images can take a few seconds
  // to appear in the UI. This allows for easy reloading if this is the case
  const [error, setError] = useState(false)

  function handleRefresh(event: any){
    event.preventDefault()
    setError(false)
  }

  if (error) {
    return (
      <Button variant="outlined" color="error" style={props} onClick={handleRefresh}>
        <RefreshIcon />
      </Button>
    )
  }
  return <img src={props.src} style={props} onError={() => setError(true)} />
}

export default PersistyImg
