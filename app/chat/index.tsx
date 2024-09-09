import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { ref, onValue } from "firebase/database";
import { auth, database } from "@/firebase";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ChatContext } from "@/contexts/ChatContext";

import { Ionicons } from "@expo/vector-icons";
import { handleSendMessage } from "@/utils/databaseUtils";
const ChatPage = () => {
  const chatId = useLocalSearchParams().chatId as string;
  const navigation = useNavigation();
  const { setChatId, setChatName } = useContext(ChatContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<Chat["users"]>({});
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!chatId) return;

    setChatId(chatId);

    const chatRef = ref(database, `chats/${chatId}`);

    return onValue(chatRef, (snapshot) => {
      const chat = snapshot.val() as Chat;
      navigation.setOptions({ headerTitle: chat.name });
      setChatName(chat.name);
      if (chat.users) {
        setUsers(chat.users);
      }
      if (chat.messages) {
        const messagesArray = Object.values(chat.messages).sort(
          (a, b) =>
            Number(new Date(a.createdAt)) - Number(new Date(b.createdAt))
        );
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    });
  }, [chatId]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"padding"}>
      <FlatList
        data={messages}
        keyExtractor={(item: Message) => item.createdAt}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.messageContainer,
              item.fromUserId === auth.currentUser?.uid
                ? styles.sentMessage
                : styles.receivedMessage,
            ]}
            key={`message-${index}`}
          >
            <Text style={styles.messageUser}>{users[item.fromUserId]}:</Text>
            <Text style={styles.messageContent}>{item.content}</Text>
            <Text style={styles.messageTime}>
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#bdbdbd"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            handleSendMessage(newMessage, chatId);
            setNewMessage("");
          }}
        >
          <Ionicons name="send" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 10,
  },
  messagesList: {
    paddingVertical: 15,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    maxWidth: "75%",
  },
  sentMessage: {
    backgroundColor: "#333333",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "#1E1E1E",
    alignSelf: "flex-start",
  },
  messageUser: {
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 5,
  },
  messageContent: {
    fontSize: 16,
    color: "#FFF",
  },
  messageTime: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#1E1E1E",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 20,
    padding: 10,
    color: "#FFF",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#121212",
    padding: 10,
    borderRadius: 20,
  },
});

export default ChatPage;
