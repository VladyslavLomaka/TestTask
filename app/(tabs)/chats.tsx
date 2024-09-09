import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { auth, database } from "@/firebase";
import { Link } from "expo-router";
import { onValue, ref } from "firebase/database";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import ChatCreationModal from "@/components/ChatCreation";

const ChatsPage = () => {
  const [chats, setChats] = useState<{ id: string; name: string }[]>([]);
  const [creationModalVisible, setCreationModalVisible] =
    useState<boolean>(false);
  useEffect(() => {
    const query = ref(database, `users/${auth.currentUser?.uid}/chatIds`);
    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        setChats(
          Object.entries(data).map((val) => {
            const [key, value] = [...val] as [string, string];
            return {
              id: key,
              name: value,
            };
          })
        );
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Chats</Text>
        <TouchableOpacity
          style={styles.addChatButton}
          onPress={() => {
            setCreationModalVisible(true);
          }}
        >
          <Ionicons name="add-circle" size={28} color="#FFD700" />
          <Text style={styles.addChatButtonText}>New Chat</Text>
        </TouchableOpacity>
        <ChatCreationModal
          visible={creationModalVisible}
          setVisible={setCreationModalVisible}
        />
      </View>

      {chats.length ? (
        <FlatList
          data={chats}
          style={styles.chatsContainer}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link
              href={{ pathname: "/chat", params: { chatId: item.id } }}
              style={styles.chatItem}
            >
              <View style={styles.chatRow}>
                <View style={styles.chatIconContainer}>
                  <Ionicons name="chatbubbles" size={30} color="#7B68EE" />
                </View>
                <View style={styles.chatTextContainer}>
                  <Text style={styles.chatTitle}>{item.name}</Text>
                </View>
              </View>
            </Link>
          )}
        />
      ) : (
        <Text style={styles.loadingText}>Add your first chat!</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#121212",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 32,
    color: "#FFD700",
    fontWeight: "bold",
  },
  addChatButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addChatButtonText: {
    fontSize: 16,
    color: "#FFD700",
    marginLeft: 8,
  },
  chatsContainer: {
    flex: 1,
  },
  chatItem: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#1E1E1E",
    marginVertical: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatIconContainer: {
    marginRight: 16,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 18,
    color: "#FFD700",
    textAlign: "center",
    marginTop: 50,
  },
});

export default ChatsPage;
