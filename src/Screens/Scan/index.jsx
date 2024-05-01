import React from "react";
import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScanScreen from "./ScanScreen";

const AppStack = createNativeStackNavigator();
const ScanIndex = () => (
  <View style={{ flex: 5 }}>
    <AppStack.Navigator
      initialRouteName="Screen2"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AppStack.Screen name="Screen2" component={ScanScreen} />
    </AppStack.Navigator>
  </View>
);

export default ScanIndex;
