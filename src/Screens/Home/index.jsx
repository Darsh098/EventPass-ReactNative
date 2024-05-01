import React from "react";
import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";

const AppStack = createNativeStackNavigator();
const HomeIndex = () => (
  <View style={{ flex: 5 }}>
    <AppStack.Navigator
      initialRouteName="Screen1"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AppStack.Screen name="Screen1" component={HomeScreen} />
    </AppStack.Navigator>
  </View>
);

export default HomeIndex;
