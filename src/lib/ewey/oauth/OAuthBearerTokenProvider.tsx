import { createContext, FC, ReactElement, useContext, useEffect, useState } from 'react';

export interface OAuthBearerTokenStorage {
  load: () => string
  store: (value: string) => void
}

export interface OAuthBearerTokenProviderProps {
  children: ReactElement | ReactElement[]
  storage?: OAuthBearerTokenStorage
}

export const OAuthBearerTokenContext = createContext<string>("")

const OAuthBearerTokenProvider: FC<OAuthBearerTokenProviderProps> = ({ children, storage }) => {
  const [token, setToken] = useState(storage?.load() || "")
  useEffect(() => {
    if (storage) {
      storage.store(token)
    }
  }, [token])
  return (
    <OAuthBearerTokenContext.Provider value={token}>
      {children}
    </OAuthBearerTokenContext.Provider>
  )
}

export default OAuthBearerTokenProvider

export const useOAuthBearerToken = () => {
  // Hack to force type checker to accept the type of the context
  const token: string = useContext(OAuthBearerTokenContext);
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
