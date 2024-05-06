import * as React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_EVENTS_BY_ORGANIZER_CLERK_ID } from "../GraphQL/Queries";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { log } from "../../logger";
import { AntDesign, Entypo } from "@expo/vector-icons";

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
  const { loading, error, data } = useQuery(GET_EVENTS_BY_ORGANIZER_CLERK_ID, {
    variables: { clerkId: user.id },
  });

  const [sessionToken, setSessionToken] = React.useState("");

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
        <TouchableOpacity onPress={onSignOutPress} style={styles.signOutButton}>
          {/* <Text style={styles.signOutButtonText}>Sign out</Text> */}
          <Entypo name="log-out" size={24} color="#5E63E9" />
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
              <View key={event.id} style={styles.eventContainer}>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <Text>Date: {event.eventDate}</Text>
                  <Text>Venue: {event.venue}</Text>
                </View>
                <TouchableOpacity style={styles.rightIconContainer}>
                  <AntDesign name="right" size={24} color="#5E63E9" />
                </TouchableOpacity>
              </View>
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
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    color: "#666",
  },
  signOutButton: {
    backgroundColor: "#E8E8E8",
    padding: 10,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: "white",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#5E63E9",
  },
  eventList: {
    flex: 1,
  },
  eventContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  eventDetails: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  rightIconContainer: {
    justifyContent: "center",
  },
});
