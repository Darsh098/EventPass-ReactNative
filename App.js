import { LogBox, StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ClerkProvider } from "@clerk/clerk-expo";
import MainRoute from "./src/MainRoute";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { tokenCache } from "./cache";

const Stack = createNativeStackNavigator();

const client = new ApolloClient({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_API_ENDPOINT,
  cache: new InMemoryCache(),
});

export default function App() {
  LogBox.ignoreAllLogs();
  const clerk_key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={clerk_key}>
      <ApolloProvider client={client}>
        <MainRoute />
      </ApolloProvider>
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
