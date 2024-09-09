import { auth, database } from "@/firebase";
import { get, push, ref, set } from "firebase/database";
import { Alert } from "react-native";

export const handleSendMessage = (newMessage: string, chatId: string) => {
  if (!newMessage.trim()) return;

  const userId = auth.currentUser?.uid;
  if (!userId) {
    Alert.alert("Error", "User not authenticated");
    return;
  }

  const messagesRef = ref(database, `chats/${chatId}/messages`);
  const newMessageRef = push(messagesRef);

  const messageData = {
    chatId,
    content: newMessage,
    createdAt: new Date().toISOString(),
    fromUserId: userId,
  };

  set(newMessageRef, messageData).catch((error) => {
    console.error("Error sending message:", error);
    Alert.alert("Error", "Failed to send message");
  });
};

export const getUsers = async () => {
  const usersRef = ref(database, `users`);
  const value = await get(usersRef);
  return value.val() as Record<string, Omit<User, "uid">>;
};
