import React, { useContext, useState } from "react";
import { View, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { get, ref, set, update } from "firebase/database";
import { auth, database } from "@/firebase";
import { ChatContext } from "@/contexts/ChatContext";
import InviteModal from "./InviteModal";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/contexts/AuthContext";

export default function ChatRightHeader() {
  const navigation = useNavigation();
  const { chatId } = useContext(ChatContext);
  const [visible, setVisible] = useState(false);

  const handleLeaveChat = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const chatRef = ref(database, `chats/${chatId}/users`);
      const chatSnapshot = await get(chatRef);
      if (chatSnapshot.exists()) {
        const users = chatSnapshot.val() as Chat["users"];

        delete users[auth.currentUser?.uid || ""];

        await update(ref(database, `chats/${chatId}`), { users: users });

        const userChatRef = ref(database, `users/${userId}/chatIds`);
        const userChatSnapshot = await get(userChatRef);
        if (userChatSnapshot.exists()) {
          const userChats = userChatSnapshot.val() || [];

          const updatedUserChats = Object.entries(userChats)
            .filter(([key, _]) => key !== chatId)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

          await set(userChatRef, updatedUserChats);
        }

        Alert.alert("Success", "You have left the chat.");
      } else {
        Alert.alert("Error", "Chat not found.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to leave chat.");
    }
    navigation.goBack();
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.iconButton}
      >
        <Ionicons name="person-add-outline" size={24} color="#FFD700" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLeaveChat} style={styles.iconButton}>
        <Ionicons name="exit-outline" size={24} color="#FFD700" />
      </TouchableOpacity>
      <InviteModal visible={visible} setVisible={setVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  iconButton: {
    marginHorizontal: 10,
  },
});
