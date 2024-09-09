import { createContext } from "react";

interface ChatContextType {
  chatId: string;
  chatName: string;
  setChatId: (chatId: string) => void;
  setChatName: (chatId: string) => void;
}

export const ChatContext = createContext<ChatContextType>({
  chatId: "",
  setChatId: () => {},
  chatName: "",
  setChatName: () => {},
});
