import { FC, ReactElement, useEffect, useRef, useState } from 'react';

export interface AnimatedHeightResizeBoxProperties {
  duration?: number
  children: ReactElement | ReactElement[]
}

const AnimatedHeightResizer: FC<AnimatedHeightResizeBoxProperties> = ({ duration, children }) => {
  if (!duration){
    duration = 0.4
  }
  const [height, setHeight] = useState('auto')
  const element = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentElement = element.current
    if (currentElement) {
      subtreeModified()
      currentElement.addEventListener('DOMSubtreeModified', subtreeModified, false);
      return () => {
        currentElement.removeEventListener('DOMSubtreeModified', subtreeModified, false);
      }
    }
  }, [element])

  function subtreeModified(){
    if(element.current){
      setHeight(`${(element.current.childNodes[0] as any).clientHeight}px`)
    }
  }

  return (
    <div ref={element} style={{height: height, overflow: "hidden", transition: `height ${duration}s ease`}}>
      <div>
        {children}
      </div>
    </div>
  )
}

export default AnimatedHeightResizer
