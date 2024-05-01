import * as React from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ScanScreen from "../Scan/ScanScreen";
import { COLORS, SPACING } from "../../theme/theme";
import HomeIndex from "../Home";
import ScanIndex from "../Scan";

const Tab = createMaterialTopTabNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="HOME"
      screenOptions={{
        tabBarActiveTintColor: COLORS.Orange,
        // tabBarLabelStyle: { color: "white" },
        tabBarStyle: {
          backgroundColor: COLORS.Black,
        },
      }}
    >
      <Tab.Screen name="HOME" component={HomeIndex} />
      <Tab.Screen name="SCAN" component={ScanIndex} />
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
