import { FC, ReactElement, useEffect, useState } from 'react'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {
  Message,
  MessageBroker,
  MessageBrokerContext,
  useMessageBroker
} from './MessageBrokerContext'

const MessageDisplayer = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState<Message | null>()
  const messageBroker = useMessageBroker()

  useEffect(() => {
    const listenerId = messageBroker.addListener(handleMessageTriggered)
    return () => {
      messageBroker.removeListener(listenerId)
    }
  })

  function handleMessageTriggered(message: Message){
    const newMessages = [...messages, message]
    setMessage(newMessages[0])
    setMessages(newMessages)
  }

  function handleClose() {
    const newMessages = messages.slice(1)
    if (newMessages.length) {
      setMessage(newMessages[0])
    }
    setMessages(newMessages)
  }

  if (!message){
    return null
  }

  return (
    <Snackbar open={!!messages.length} autoHideDuration={message.duration || null}>
      <Alert onClose={handleClose} severity={message.severity} sx={{ width: '100%' }}>
        {message.text}
      </Alert>
    </Snackbar>
  )
}

export interface MessageDisplayProviderProps {
  children: ReactElement | ReactElement[]
}

export const MessageDisplayProvider: FC<MessageDisplayProviderProps> = ({ children }) => {
  return (
    <MessageBrokerContext.Provider value={new MessageBroker()}>
      {children}
      <MessageDisplayer />
    </MessageBrokerContext.Provider>
  )
}
