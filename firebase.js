import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8YitrDoWJUiHsMwSDCjXGdFfMzaerF-g",
  authDomain: "messenger-81fad.firebaseapp.com",
  projectId: "messenger-81fad",
  storageBucket: "messenger-81fad.appspot.com",
  messagingSenderId: "648912643804",
  appId: "1:648912643804:web:eee817049186ec42a7f619",
  databaseURL:
    "https://messenger-81fad-default-rtdb.europe-west1.firebasedatabase.app",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const database = getDatabase(app);
