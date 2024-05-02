import * as React from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { COLORS, SPACING } from "../../Theme/theme";
import HomeIndex from "../Home";
import ScanIndex from "../Scan";
import MyProfileScreen from "../MyProfileScreen";

const Tab = createMaterialTopTabNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="HOME"
      screenOptions={{
        // tabBarActiveTintColor: COLORS.Orange,
        tabBarLabelStyle: { color: "white" },
        tabBarStyle: {
          backgroundColor: COLORS.Black,
        },
      }}
    >
      <Tab.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{ title: "MyProfile" }}
      />
      <Tab.Screen name="Home" component={HomeIndex} />
      <Tab.Screen name="Scan" component={ScanIndex} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  activeTabBackground: {
    backgroundColor: COLORS.Black,
    padding: SPACING.space_18,
    borderRadius: SPACING.space_18 * 10,
  },
});

export default TabScreen;
