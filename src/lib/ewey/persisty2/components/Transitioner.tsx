import Fade from "@mui/material/Fade"
import Slide from "@mui/material/Slide"
import { CSSProperties, ReactNode, useEffect, useState } from "react"

export interface TransitionerProps {
  show: boolean
  children: ReactNode
  loadingWidth?: string
}

export default function Transitioner({ show, children, loadingWidth }: TransitionerProps) { 
  
  const [transitioning, setTransitioning] = useState(false)
  useEffect(() => {
    console.log('begin transition')
    setTransitioning(true)
  }, [show])
  if (!loadingWidth) {
    loadingWidth = 'calc(100% - 16px)';
  }
  // const style: CSSProperties = transitioning ? {position: "absolute", width: loadingWidth} : {}
  const style: CSSProperties = {position: "absolute", width: loadingWidth}
  return (
    <Fade 
      in={show} 
      unmountOnExit 
      timeout={2000} 
      onTransitionEnd={() => {
        console.log('end transition')
        setTransitioning(false)}
      }
    >
      <div style={style}>
        {children}
      </div>
    </Fade>
  )
  
  /*
  return (
    <Slide
      in={show}
      unmountOnExit
      timeout={2000}
    >
      <div>
        {children}
      </div>
    </Slide>
  )
  */
}