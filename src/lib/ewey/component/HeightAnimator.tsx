import { CSSProperties, ReactElement, useEffect, useRef } from "react"

export interface HeightAnimatorProps {
  children: ReactElement | ReactElement[]
}

export default function HeightAnimator({ children }: HeightAnimatorProps) {
  const container = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const current = container.current
      if (current) {
      current.style.height = (current.childNodes[0] as Element).clientHeight + "px"
      }
    })
    if (container.current){
      resizeObserver.observe(container.current.childNodes[0] as Element)
    }
    return () => {
      resizeObserver.disconnect()
    }
  })

  const style: CSSProperties = {
    overflow: "hidden",
    padding: "0",
    border: "none",
    boxSizing: "border-box",
    transition: "height 0.2s ease-in-out"
  }

  return (
    <div ref={container} style={style}>
      <div>
        {children}
      </div>
    </div>
  )
}