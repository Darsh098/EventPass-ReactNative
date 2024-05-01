import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import MainRoute from "./src/MainRoute";
import { NavigationContainer } from "@react-navigation/native";
import Constants from "expo-constants";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import MainRoute from "./src/MainRoute";

const Stack = createNativeStackNavigator();

export default function App() {
  const app_key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
  return (
    <ClerkProvider
      publishableKey={app_key}>
      <NavigationContainer>
        <MainRoute />
      </NavigationContainer>
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
