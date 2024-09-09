import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { onValue, ref, update } from "firebase/database";
import { auth, database } from "@/firebase";
import { ChatContext } from "@/contexts/ChatContext";
import { handleSendMessage } from "@/utils/databaseUtils";
import { Ionicons } from "@expo/vector-icons";

interface InviteModalProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
}

export default function InviteModal({ visible, setVisible }: InviteModalProps) {
  const [search, setSearch] = useState<string>("");
  const { chatId, chatName } = useContext(ChatContext);
  const [users, setUsers] = useState<Omit<User, "email" | "chatIds">[]>([]);

  const addUserToChat = (userId: string, nickname: string) => {
    const chatRef = ref(database, `chats/${chatId}/users`);
    const userChatRef = ref(database, `users/${userId}/chatIds/`);

    update(chatRef, { [userId]: nickname })
      .then(() => update(userChatRef, { [chatId]: chatName }))
      .catch((error) => console.error("Error adding user to chat:", error));
  };

  useEffect(() => {
    const query = ref(database, `users`);
    return onValue(query, (snapshot) => {
      const data = snapshot.val() as User[];
      if (snapshot.exists()) {
        const users = Object.entries(data).map(([key, value]) => ({
          uid: key,
          nickname: value.nickname,
        }));
        setUsers(users);
      }
    });
  }, []);

  return (
    <Modal
      visible={visible}
      onRequestClose={() => setVisible(false)}
      transparent
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Invite Users</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close-outline" size={24} color="#FFD700" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by nickname or ID"
            placeholderTextColor="#bdbdbd"
            onChangeText={setSearch}
          />
          <FlatList
            data={users.filter(
              ({ nickname, uid }) =>
                nickname.toLowerCase().includes(search.toLowerCase()) ||
                uid.toLowerCase().includes(search.toLowerCase())
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => {
                  addUserToChat(item.uid, item.nickname);
                  handleSendMessage(`invited ${item.nickname}!`, chatId);
                  setVisible(false);
                }}
              >
                <Text style={styles.userText}>{item.nickname}</Text>
                <Text style={styles.userSubText}>{item.uid}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.uid}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    color: "#FFD700",
  },
  searchInput: {
    backgroundColor: "#333333",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    color: "#FFF",
  },
  userItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  userText: {
    color: "#FFD700",
    fontSize: 16,
  },
  userSubText: {
    color: "#999",
    fontSize: 12,
  },
});
