import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useQuery } from "@apollo/client";
import QRCode from "react-native-qrcode-svg";
import { GET_EVENT_VISITOR_BY_USER_CLERK_ID } from "../../GraphQL/Queries";
import { useUser } from "@clerk/clerk-expo";

const HomeScreen = ({ params }) => {
  const { user } = useUser();
  const [eventInvitations, setEventInvitations] = useState([]);

  const { loading, error, data } = useQuery(
    GET_EVENT_VISITOR_BY_USER_CLERK_ID,
    {
      variables: { clerkId: user.id },
    }
  );

  useEffect(() => {
    if (data && data.getEventVisitorByUserClerkId) {
      const eventVisitors = data.getEventVisitorByUserClerkId;
      const invitations = eventVisitors.map((visitor) => {
        return (
          <View key={visitor.id} style={styles.invitationContainer}>
            <View style={styles.detailsContainer}>
              <Text style={styles.eventName}>{visitor.events.name}</Text>
              <View style={styles.eventDetailsContainer}>
                <Text style={styles.eventDetail}>
                  Date: {visitor.events.eventDate}
                </Text>
                <Text style={styles.eventDetail}>
                  Organizer: {visitor.events.organizer.firstName}{" "}
                  {visitor.events.organizer.lastName}
                </Text>
                <Text style={styles.eventDetail}>
                  Venue: {visitor.events.venue}
                </Text>
              </View>
            </View>
            <View style={styles.qrCodeContainer}>
              <QRCode
                // color="#5E63E9"
                enableLinearGradient={true}
                linearGradient={["#AEB2E5", "#5E63E9"]}
                value={visitor.id.toString()}
              />
            </View>
          </View>
        );
      });
      setEventInvitations(invitations);
    }
  }, [data]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Invitations</Text>
      {eventInvitations.length > 0 ? (
        eventInvitations
      ) : (
        <Text>No Invitations</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#5E63E9",
  },
  invitationContainer: {
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  detailsContainer: {
    flexDirection: "column",
  },
  eventName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginRight: 20,
    color: "#333",
  },
  eventDetailsContainer: {
    flex: 1,
  },
  eventDetail: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  qrCodeContainer: {
    alignItems: "flex-end",
  },
});

export default HomeScreen;
