import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabScreen from "./Screens/Tabs";
import { ClerkLoaded, useUser } from "@clerk/clerk-expo";
import * as SplashScreen from "expo-splash-screen";
import SignUpScreen from "./Screens/SignUpScreen";
import SignInScreen from "./Screens/SignInScreen";
import VerifyCodeScreen from "./Screens/VerifyCodeScreen";
import { NavigationContainer } from "@react-navigation/native";
import EventDetail from "./Components/EventDetail";
import EventVisitorsDetail from "./Components/EventVisitorDetail";
import EditEventScreen from "./Screens/EditEvent/EditEventScreen";

const Stack = createNativeStackNavigator();

const MainRoute = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

const RootNavigator = () => {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  return (
    <>
      <ClerkLoaded>
        <Stack.Navigator>
          {isSignedIn ? (
            <>
              <Stack.Screen
                name="Tab"
                component={TabScreen}
                options={{ title: "EventPass" }}
              />
              <Stack.Screen
                name="EventDetail"
                component={EventDetail}
                options={{ title: "Event Details" }}
              />
              <Stack.Screen
                name="EventVisitorsDetail"
                component={EventVisitorsDetail}
                options={{ title: "Event Details" }}
              />

              <Stack.Screen
                name="EditEvent"
                component={EditEventScreen}
                options={{ title: "Edit Event" }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ title: "Sign Up" }}
              />
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{ title: "Sign In" }}
              />
              <Stack.Screen
                name="VerifyCode"
                component={VerifyCodeScreen}
                options={{ title: "Sign Up" }}
              />
            </>
          )}
        </Stack.Navigator>
      </ClerkLoaded>
    </>
  );
};

export default MainRoute;
