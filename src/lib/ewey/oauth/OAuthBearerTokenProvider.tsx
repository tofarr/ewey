import { createContext, FC, ReactElement, useContext, useEffect, useState } from 'react';

export interface OAuthBearerTokenStorage {
  load: () => string
  store: (value: string) => void
}

export interface OAuthBearerTokenProviderProps {
  children: ReactElement | ReactElement[]
  storage?: OAuthBearerTokenStorage
}

export interface BearerToken{
  token: string
  setToken: (token: string) => void
}

export const OAuthBearerTokenContext = createContext<BearerToken | null>(null)

const OAuthBearerTokenProvider: FC<OAuthBearerTokenProviderProps> = ({ children, storage }) => {
  const [token, setToken] = useState("")/*storage?.load() || "")
  useEffect(() => {
    if (storage) {
      storage.store(token)
    }
  }, [token])*/
  console.log("TRACE:OAuthBearerTokenProvider", token)
  return (
    <OAuthBearerTokenContext.Provider value={{token, setToken}}>
      {children}
    </OAuthBearerTokenContext.Provider>
  )
}

export default OAuthBearerTokenProvider

export const useOAuthBearerToken = () => {
  // Hack to force type checker to accept the type of the context
  const token = useContext(OAuthBearerTokenContext) as BearerToken;
  return token;
}

export class Storage implements OAuthBearerTokenStorage {
  storage: any
  key: string

  constructor(storage?: string, key?: string) {
    this.storage = storage || localStorage
    this.key = key || "eweyBearerToken"
  }

  load() {
    return this.storage.getItem(this.key)
  }

  store(value: string) {
    return this.storage.setItem(this.key, value)
  }
}
