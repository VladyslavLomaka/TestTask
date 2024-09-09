import React, { useContext, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { ref, push, set } from "firebase/database";
import { auth, database } from "@/firebase";
import { AuthContext } from "@/contexts/AuthContext";

interface ChatCreationModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatCreationModal = ({ visible, setVisible }: ChatCreationModalProps) => {
  const [chatName, setChatName] = useState("");
  const { nickname } = useContext(AuthContext);

  const handleCreateChat = () => {
    const newChatRef = push(ref(database, "chats"));
    const chatId = newChatRef.key;

    const chatData = {
      name: chatName,
      createdAt: new Date().toISOString(),
      users: { [`${auth.currentUser?.uid}`]: nickname },
    };

    set(newChatRef, chatData)
      .then(() => {
        const userChatRef = ref(
          database,
          `users/${auth.currentUser?.uid}/chatIds/${chatId}`
        );

        set(userChatRef, chatName)
          .then(() => {
            Alert.alert("Success", "Chat created successfully.");
            handleClose();
          })
          .catch(() => {
            Alert.alert("Error", "Failed to associate chat with user.");
          });
      })
      .catch(() => {
        Alert.alert("Error", "Failed to create chat.");
      });
  };

  const handleClose = () => {
    setVisible(false);
    setChatName("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Create New Chat</Text>
          <TextInput
            style={styles.input}
            value={chatName}
            onChangeText={setChatName}
            placeholder="Chat Name"
            placeholderTextColor="#bdbdbd"
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateChat}
          >
            <Text style={styles.createButtonText}>Create Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#2E2E2E",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    backgroundColor: "#3D3D3D",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: "#FFF",
  },
  createButton: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  createButtonText: {
    color: "#1E1E1E",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#555555",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default ChatCreationModal;
