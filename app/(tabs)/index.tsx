import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Text,
  SafeAreaView,
  Alert,
} from "react-native";
import { auth, database } from "@/firebase";
import { useContext, useEffect, useState } from "react";
import { onValue, ref, update } from "firebase/database";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "@/contexts/AuthContext";
import * as Clipboard from "expo-clipboard";

export default function HomeScreen() {
  const [userName, setUserName] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const { setNickname } = useContext(AuthContext);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const userUid = auth.currentUser?.uid || null;
    setUid(userUid); // Set the UID
    const query = ref(database, `users/${userUid}`);
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        setNickname(data.nickname);
        setUserName(data.nickname);
      }
    });
  }, []);

  const handleChangeNickname = () => {
    const userRef = ref(database, `users/${auth.currentUser?.uid}`);
    update(userRef, { nickname: newUserName });
  };

  const handleCopyUid = () => {
    if (uid) {
      Clipboard.setStringAsync(uid);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://avatar.iran.liara.run/public/42" }}
          style={styles.profileImage}
        />
        <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
      </View>

      {uid && (
        <View style={styles.uidContainer}>
          <Text style={styles.uidText}>Your UID: {uid}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyUid}>
            <Ionicons name="copy-outline" size={20} color="#121212" />
            <Text style={styles.copyButtonText}>Copy UID</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.nicknameContainer}>
        <TextInput
          style={styles.nicknameInput}
          placeholder="Change your nickname"
          placeholderTextColor="#bdbdbd"
          onChangeText={(text) => setNewUserName(text)}
          value={newUserName}
          defaultValue={userName}
        />
        <TouchableOpacity
          style={styles.nicknameButton}
          onPress={handleChangeNickname}
        >
          <Ionicons name="create" size={20} color="#121212" />
          <Text style={styles.buttonText}>Change Nickname</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.signOutButton]}
          onPress={() => {
            auth.signOut();
          }}
        >
          <Ionicons name="log-out" size={20} color="#FFD700" />
          <Text style={styles.actionButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
    justifyContent: "space-around",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#FFD700",
    marginRight: 15,
  },
  welcomeText: {
    fontSize: 26,
    color: "#FFD700",
    fontWeight: "bold",
    flexWrap: "wrap",
    flex: 1,
  },
  uidContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  uidText: {
    color: "#FFD700",
    fontSize: 16,
    marginBottom: 10,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  copyButtonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  nicknameContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  nicknameInput: {
    width: "100%",
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: "#1E1E1E",
    borderColor: "#FFD700",
    borderWidth: 1,
    color: "#FFF",
    marginBottom: 10,
  },
  nicknameButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "60%",
  },
  buttonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  actionsContainer: {
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E1E1E",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  signOutButton: {
    backgroundColor: "#5c0f00",
  },
  actionButtonText: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});
