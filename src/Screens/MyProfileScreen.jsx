import * as React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_EVENTS_BY_ORGANIZER_CLERK_ID } from "../GraphQL/Queries";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { log } from "../../logger";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  BORDERRADIUS,
  COLORS,
  FONTSIZE,
  RouteNames,
  SPACING,
} from "../Common/constants";

export default function SafeMyProfileScreen(props) {
  return (
    <>
      <SignedIn>
        <MyProfileScreen {...props} />
      </SignedIn>
      <SignedOut>
        <View style={styles.container}>
          <Text style={styles.unauthorizedText}>Unauthorized</Text>
        </View>
      </SignedOut>
    </>
  );
}

function MyProfileScreen({ navigation }) {
  const { getToken, signOut } = useAuth();
  const { user } = useUser();
  const { loading, error, data, refetch } = useQuery(
    GET_EVENTS_BY_ORGANIZER_CLERK_ID,
    {
      variables: { clerkId: user.id },
    }
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await refetch();
        } catch (error) {
          console.error("Error refetching data:", error);
        }
      };

      fetchData();

      return () => {}; // Cleanup function
    }, [])
  );

  const [sessionToken, setSessionToken] = React.useState("");

  const confirmSignOut = () => {
    Alert.alert(
      "Confirm Signout",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => onSignOutPress(),
        },
      ],
      { cancelable: false }
    );
  };

  const onSignOutPress = async () => {
    try {
      await signOut();
    } catch (err) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  };

  React.useEffect(() => {
    const scheduler = setInterval(async () => {
      const token = await getToken();
      setSessionToken(token);
    }, 1000);

    return () => clearInterval(scheduler);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          {user?.imageUrl && (
            <Image
              source={{ uri: user.imageUrl }}
              style={styles.profileImage}
            />
          )}
          <View>
            <Text style={styles.greeting}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.email}>
              {user?.primaryEmailAddress?.emailAddress}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={confirmSignOut} style={styles.signOutButton}>
          {/* <Text style={styles.signOutButtonText}>Sign out</Text> */}
          <Entypo
            name="log-out"
            size={FONTSIZE.size_24}
            color={COLORS.Primary}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <Text style={styles.heading}>Events Created By You</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>Error: {error.message}</Text>
      ) : (
        <View style={styles.eventList}>
          {data.getEventsByOrganizerClerkId.length > 0 ? (
            data.getEventsByOrganizerClerkId.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventContainer}
                onPress={() =>
                  navigation.navigate(RouteNames.EVENT_VISITOR_DETAIL_SCREEN, {
                    eventDetails: event,
                  })
                }
              >
                <View style={styles.eventDetails}>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <Text>Date: {event.eventDate}</Text>
                  <Text>Venue: {event.venue}</Text>
                </View>
                <View style={styles.rightIconContainer}>
                  <AntDesign
                    name="right"
                    size={FONTSIZE.size_24}
                    color={COLORS.Primary}
                  />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No events created</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.space_20,
    backgroundColor: COLORS.LightGrey,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.space_20,
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: SPACING.space_40,
    height: SPACING.space_40,
    borderRadius: BORDERRADIUS.radius_20,
    marginRight: SPACING.space_10,
  },
  greeting: {
    fontSize: FONTSIZE.size_24,
    fontWeight: "bold",
    color: COLORS.DarkGrey,
  },
  email: {
    color: COLORS.MediumGrey,
  },
  signOutButton: {
    backgroundColor: COLORS.IconBackground,
    padding: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_8,
  },
  signOutButtonText: {
    color: COLORS.White,
  },
  separator: {
    borderBottomWidth: SPACING.space_1,
    borderBottomColor: COLORS.LightGrey2,
    marginBottom: SPACING.space_20,
  },
  heading: {
    fontSize: FONTSIZE.size_20,
    fontWeight: "bold",
    marginBottom: SPACING.space_10,
    color: COLORS.Primary,
  },
  eventList: {
    flex: 1,
  },
  eventContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: SPACING.space_1,
    borderColor: COLORS.LightGrey2,
    borderRadius: BORDERRADIUS.radius_8,
    padding: SPACING.space_10,
    marginBottom: SPACING.space_10,
    backgroundColor: COLORS.White,
  },
  eventDetails: {
    flex: 1,
  },
  eventName: {
    fontSize: FONTSIZE.size_16,
    fontWeight: "bold",
    color: COLORS.DarkGrey,
    marginBottom: SPACING.space_5,
  },
  rightIconContainer: {
    marginLeft: SPACING.space_15,
    justifyContent: "center",
  },
});
