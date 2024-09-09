import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password).catch((err) => {
      Alert.alert("Login Error", err.message);
    });
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userRef = ref(database, `users/${user.uid}`);
        set(userRef, {
          email: user.email,
          nickname: `user${(Math.random() * 100000000) | 0}`,
          chatIds: [],
        }).catch(() => {
          Alert.alert("Database Error", "Failed to add user to the database.");
        });
      })
      .catch((err) => {
        Alert.alert("Sign Up Error", err.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={24}
          color="#bdbdbd"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bdbdbd"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color="#bdbdbd"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#bdbdbd"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={handleSignUp}>
        <Text style={styles.buttonOutlineText}>Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  title: {
    fontSize: 28,
    color: "#FFD700",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333333",
    borderRadius: 8,
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#FFF",
  },
  button: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#1E1E1E",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonOutline: {
    borderColor: "#FFD700",
    borderWidth: 2,
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOutlineText: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 16,
  },
});
