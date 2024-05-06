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
            firstName: firstName,
            lastName: lastName,
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
      initialRouteName="Home"
      screenOptions={{
        tabBarLabelStyle: { color: "white" },
        tabBarStyle: {
          // backgroundColor: COLORS.Black,
          backgroundColor: "#0D1117",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeIndex}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={24}
              color={focused ? "#5E63E9" : "#AEB2E5"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{
          // title: "Create"
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="post-add"
              size={24}
              color={focused ? "#5E63E9" : "#AEB2E5"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanIndex}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="line-scan"
              size={24}
              color={focused ? "#5E63E9" : "#AEB2E5"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{
          // title: "Profile"
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Feather
              name="user"
              size={24}
              color={focused ? "#5E63E9" : "#AEB2E5"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabScreen;
