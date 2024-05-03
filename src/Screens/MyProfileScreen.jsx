import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_EVENTS_BY_ORGANIZER_CLERK_ID } from "../GraphQL/Queries";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { log } from "../../logger";

export default function SafeMyProfileScreen(props) {
  return (
    <>
      <SignedIn>
        <MyProfileScreen {...props} />
      </SignedIn>
      <SignedOut>
        <View style={styles.container}>
          <Text>Unauthorized</Text>
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
        <Text style={styles.greeting}>Hello {user?.firstName}</Text>
        <TouchableOpacity onPress={onSignOutPress} style={styles.signOutButton}>
          <Text style={styles.signOutButtonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <Text style={styles.heading}>Events Created By You</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <View style={styles.eventList}>
          {data.getEventsByOrganizerClerkId.length > 0 ? (
            data.getEventsByOrganizerClerkId.map((event) => (
              <View key={event.id} style={styles.eventContainer}>
                <Text style={styles.eventName}>{event.name}</Text>
                <Text>Date: {event.eventDate}</Text>
                <Text>Venue: {event.venue}</Text>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  signOutButton: {
    backgroundColor: "#2e78b7",
    padding: 10,
    borderRadius: 5,
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
  },
  eventList: {
    flex: 1,
  },
  eventContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
