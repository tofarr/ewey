import { createContext, useContext } from "react";
import { AlertColor } from "@mui/material/Alert";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  timestamp: Date;
  text: string;
  severity: AlertColor;
  duration: number;
}

export interface MessageListener {
  id: string;
  callback: (message: Message) => void;
}

export class MessageBroker {
  listeners: MessageListener[];

  constructor() {
    this.listeners = [];
  }

  addListener(callback: (message: Message) => void, id?: string) {
    if (!id) {
      id = uuidv4();
    }
    this.listeners.push({ id, callback });
    return id;
  }

  removeListener(listenerId: string) {
    this.listeners = this.listeners.filter(
      (listener) => listener.id !== listenerId,
    );
  }

  triggerMessage(
    text: string,
    severity: AlertColor = "info",
    duration: number = 10000,
  ) {
    const message = { timestamp: new Date(), text, severity, duration };
    for (const listener of this.listeners) {
      listener.callback(message);
    }
  }

  triggerError(error: any) {
    if (error.message) {
      error = error.message;
    } else if (error) {
      error = error.toString();
    } else {
      error = "Unknown Error";
    }
    this.triggerMessage(error, "error", 15000);
  }
}

export const MessageBrokerContext = createContext<MessageBroker>(
  new MessageBroker(),
);

export const useMessageBroker = () => {
  const broker = useContext(MessageBrokerContext);
  return broker;
};
