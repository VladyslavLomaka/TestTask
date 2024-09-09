import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { getAuth } from "firebase/auth";

import { useColorScheme } from "@/hooks/useColorScheme";
import { app } from "@/firebase";
import Auth from "./auth";
import ChatRightHeader from "@/components/ChatHeader";
import { ChatContext } from "@/contexts/ChatContext";
import { AuthContext } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const auth = getAuth(app);
  const [userExists, setUserExists] = useState<boolean>(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [chatId, setChatId] = useState<string>("");
  const [chatName, setChatName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  useEffect(() => {
    if (auth.currentUser) {
      setUserExists(true);
    }
    auth.onAuthStateChanged((state) => {
      if (auth.currentUser) {
        setUserExists(true);
      } else {
        setUserExists(false);
      }
    });
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {userExists ? (
        <ChatContext.Provider
          value={{ chatId, setChatId, setChatName, chatName }}
        >
          <AuthContext.Provider value={{ nickname, setNickname }}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="chat/index"
                options={{ headerRight: ChatRightHeader }}
              />
            </Stack>
          </AuthContext.Provider>
        </ChatContext.Provider>
      ) : (
        <Auth />
      )}
    </ThemeProvider>
  );
}
