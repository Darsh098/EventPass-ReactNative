import * as React from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabScreen from "./Screens/Tabs";
import AuthIndex from "./Screens/auth";

const AppStack = createNativeStackNavigator();

const MainRoute = () => {
  return (
    <>
      <View style={{ flex: 5 }}>
        <AppStack.Navigator
          initialRouteName="AUTH"
          screenOptions={{
            headerShown: false,
          }}
        >
          <AppStack.Screen name="AUTH" component={AuthIndex} />
          <AppStack.Screen name="TAB" component={TabScreen} />
        </AppStack.Navigator>
      </View>
    </>
  );
};

export default MainRoute;
