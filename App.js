import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import MainRoute from "./src/MainRoute";
import { NavigationContainer } from "@react-navigation/native";
import Constants from "expo-constants";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig.extra.clerkPublishableKey}
    >
      <NavigationContainer>
        {/* <MainRoute /> */}
        <SignedIn>
          <Text>You are Signed in</Text>
        </SignedIn>
        <SignedOut>
          <Text>You are Signed out</Text>
        </SignedOut>
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
