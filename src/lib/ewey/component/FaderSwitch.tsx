import { ReactElement } from "react"

export interface FaderSwitchProps {
  children: ReactElement | ReactElement[]
}

/**
 * Switch for fader components - prevents bumping when hiding later components
 * "I have altered the deal. Pray I do not alter it any further!"
 */
export default function FaderSwitch({ children }: FaderSwitchProps) {
return (
    <div style={{position: "relative"}}>
      {children}
    </div>
  )
}
