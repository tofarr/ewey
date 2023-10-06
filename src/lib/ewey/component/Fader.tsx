import { CSSProperties, ReactElement, useEffect, useRef, useState } from "react"

export interface FaderProps {
  show: boolean
  timeout?: number
  children: ReactElement | ReactElement[]
}

/**
 * (Darth) Fader. Because the fade from materialui and the fade from React Transition Group did not work the way I wanted.
 * Should be placed inside a component with non static positioning
 * "I have altered the deal. Pray I do not alter it any further!"
 */
export default function Fader({ show, timeout, children }: FaderProps) {
  if (!timeout){
    timeout = 200
  }
  const container = useRef<HTMLDivElement | null>(null)

  const [showing, setShowing] = useState<boolean|null>(null)

  useEffect(() => {
    setShowing(!show)
    const timeoutHandle = setTimeout(() => setShowing(show), timeout)
    return () => {
      clearTimeout(timeoutHandle)
    }
  }, [show, timeout])

  const containerStyle: CSSProperties = {
    opacity: container.current && show ? 1 : 0,
    transition: `opacity ${timeout}ms`
  }
  if (!show && (!showing || !container.current)){
    return null // unmount
  }
  const innerStyle: CSSProperties = {}
  if (container.current && showing && !show) {
    containerStyle['position'] = "absolute"
    containerStyle['left'] = "0"
    containerStyle['top'] = "0"
    innerStyle['width'] = `${container.current.clientWidth}px`
  }

  return (
    <div ref={container} style={containerStyle}>
      <div style={innerStyle}>
        {children}
      </div>
    </div>
  )
}
