import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabScreen from "./Screens/Tabs";
import { ClerkLoaded, useUser } from "@clerk/clerk-expo";
import * as SplashScreen from "expo-splash-screen";
import SignUpScreen from "./Screens/SignUpScreen";
import SignInScreen from "./Screens/SignInScreen";
import VerifyCodeScreen from "./Screens/VerifyCodeScreen";
import { NavigationContainer } from "@react-navigation/native";

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

  React.useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  return (
    <>
      <ClerkLoaded>
        <Stack.Navigator>
          {isSignedIn ? (
            <Stack.Screen name="Tab" component={TabScreen} />
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
