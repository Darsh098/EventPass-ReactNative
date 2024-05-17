import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeIndex from "../Home";
import ScanIndex from "../Scan";
import MyProfileScreen from "../MyProfileScreen";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../GraphQL/Mutations";
import { useUser } from "@clerk/clerk-expo";
import CreateEventScreen from "../CreateEvent/CreateEventScreen";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import { COLORS, FONTSIZE, RouteNames } from "../../Common/constants";

const Tab = createMaterialTopTabNavigator();

const TabScreen = () => {
  const [createUser] = useMutation(CREATE_USER);
  const [currentUser, setCurrentUser] = useState(null);
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    const registerUser = async (userData) => {
      try {
        const {
          id,
          firstName,
          lastName,
          primaryEmailAddress,
          imageUrl,
          primaryPhoneNumber,
        } = userData;

        const firstNameValue = firstName ?? "";
        const lastNameValue = lastName ?? "";

        let mobileNumber = null;
        if (primaryPhoneNumber) {
          mobileNumber = primaryPhoneNumber.phoneNumber;
        }

        let profilePhoto = null;
        if (imageUrl) {
          profilePhoto = imageUrl;
        }

        const { data } = await createUser({
          variables: {
            firstName: firstNameValue,
            lastName: lastNameValue,
            clerkId: id,
            email: primaryEmailAddress.emailAddress,
            profilePhoto: profilePhoto,
          },
        });
        setCurrentUser(data.createUser);
      } catch (error) {
        console.error("Error registering user:", error);
      }
    };

    if (isSignedIn && user) {
      registerUser(user);
    }
  }, [isLoaded]);

  return (
    <Tab.Navigator
      initialRouteName={RouteNames.HOME_SCREEN}
      screenOptions={{
        tabBarLabelStyle: { color: COLORS.White },
        tabBarStyle: {
          backgroundColor: COLORS.TabBackground,
        },
      }}
    >
      <Tab.Screen
        name={RouteNames.HOME_SCREEN}
        component={HomeIndex}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={FONTSIZE.size_24}
              color={focused ? COLORS.Primary : COLORS.Secondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name={RouteNames.CREATE_EVENT_SCREEN}
        component={CreateEventScreen}
        options={{
          // title: "Create"
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="post-add"
              size={FONTSIZE.size_24}
              color={focused ? COLORS.Primary : COLORS.Secondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name={RouteNames.SCAN_SCREEN}
        component={ScanIndex}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="line-scan"
              size={FONTSIZE.size_24}
              color={focused ? COLORS.Primary : COLORS.Secondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name={RouteNames.PROFILE_SCREEN}
        component={MyProfileScreen}
        options={{
          // title: "Profile"
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Feather
              name="user"
              size={FONTSIZE.size_24}
              color={focused ? COLORS.Primary : COLORS.Secondary}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabScreen;
