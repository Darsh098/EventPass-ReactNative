import * as React from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabScreen from "./Screens/Tabs";
import AuthIndex from "./Screens/auth";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

const AppStack = createNativeStackNavigator();

const MainRoute = () => {
  return (
    <>
      <SignedIn>
        <View style={{ flex: 5 }}>
          <AppStack.Navigator
            initialRouteName="TAB"
            screenOptions={{
              headerShown: false,
            }}
          >
            <AppStack.Screen name="TAB" component={TabScreen} />
          </AppStack.Navigator>
        </View>
      </SignedIn>
      <SignedOut>
        <View style={{ flex: 5 }}>
          <AppStack.Navigator
            initialRouteName="AUTH"
            screenOptions={{
              headerShown: false,
            }}
          >
            <AppStack.Screen name="AUTH" component={AuthIndex} />
          </AppStack.Navigator>
        </View>
      </SignedOut>
    </>
  );
};

export default MainRoute;
