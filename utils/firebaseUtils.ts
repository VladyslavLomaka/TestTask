import { database } from "@/firebase";
import { onValue, ref } from "firebase/database";
import "firebase/database";

export const getChatsForUser = async (userId: string) => {
  try {
    const query = ref(database, "chats");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        Object.values(data).map((chat) => {
          return chat as Chat[];
        });
      }
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
};
