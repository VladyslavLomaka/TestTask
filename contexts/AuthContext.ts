import { createContext } from "react";

interface AuthContextType {
  nickname: string;
  setNickname: (nickname: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  nickname: "",
  setNickname: () => {},
});
