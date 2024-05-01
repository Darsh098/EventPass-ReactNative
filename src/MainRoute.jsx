import * as React from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabScreen from "./Screens/Tabs";

const AppStack = createNativeStackNavigator();

const MainRoute = () => {
  return (
    <>
      <View style={{ flex: 5 }}>
        <AppStack.Navigator
          initialRouteName="TAB"
          screenOptions={{
            headerShown: false,
            // animation: "slide_from_right",
            // presentation: "transparent",
          }}
        >
          <AppStack.Screen name="TAB" component={TabScreen} />
        </AppStack.Navigator>
      </View>
    </>
  );
};

export default MainRoute;
