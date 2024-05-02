import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ClerkProvider } from "@clerk/clerk-expo";
import MainRoute from "./src/MainRoute";

const Stack = createNativeStackNavigator();

export default function App() {
  const clerk_key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <ClerkProvider publishableKey={clerk_key}>
      <MainRoute />
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
