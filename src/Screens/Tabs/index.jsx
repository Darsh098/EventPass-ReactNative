import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { COLORS, SPACING } from "../../Theme/theme";
import HomeIndex from "../Home";
import ScanIndex from "../Scan";
import MyProfileScreen from "../MyProfileScreen";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../GraphQL/Mutations";
import { useUser } from "@clerk/clerk-expo";
import CreateEventScreen from "../CreateEvent/CreateEventScreen";

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
        // tabBarActiveTintColor: COLORS.Orange,
        tabBarLabelStyle: { color: "white" },
        tabBarStyle: {
          backgroundColor: COLORS.Black,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeIndex} />
      <Tab.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{ title: "Create" }}
      />
      <Tab.Screen name="Scan" component={ScanIndex} />
      <Tab.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{ title: "Profile" }}
      />
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
