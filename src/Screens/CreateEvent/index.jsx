import React from "react";
import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateEventScreen from "./CreateEventScreen";

const AppStack = createNativeStackNavigator();
const HomeIndex = () => (
  <View style={{ flex: 5 }}>
    <AppStack.Navigator
      initialRouteName="CreateEventScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AppStack.Screen name="CreateEventScreen" component={CreateEventScreen} />
    </AppStack.Navigator>
  </View>
);

export default HomeIndex;
