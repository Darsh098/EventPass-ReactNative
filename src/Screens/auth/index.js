import React from "react";
import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./login";

const AuthStack = createNativeStackNavigator();
const AuthIndex = () => (
    <View style={{ flex: 5 }}>
        <AuthStack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
            }}
        >
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="SignIn" component={LoginScreen} />
        </AuthStack.Navigator>
    </View>
);

export default AuthIndex;
