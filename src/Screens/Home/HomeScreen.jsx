import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import QRCode from "react-native-qrcode-svg";
import { GET_EVENT_VISITOR_BY_USER_CLERK_ID } from "../../GraphQL/Queries";
import { useUser } from "@clerk/clerk-expo";
import { UPDATE_EVENT_EXPIRED_STATUS } from "../../GraphQL/Mutations";
import { useFocusEffect } from "@react-navigation/native";
import {
  RouteNames,
  COLORS,
  SPACING,
  FONTSIZE,
  BORDERRADIUS,
} from "../../Common/constants";

const HomeScreen = ({ navigation }) => {
  const { user } = useUser();
  const { loading, error, data, refetch } = useQuery(
    GET_EVENT_VISITOR_BY_USER_CLERK_ID,
    {
      variables: { clerkId: user.id },
    }
  );

  useFocusEffect(
    useCallback(() => {
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

  const [updateEventExpiredStatus] = useMutation(UPDATE_EVENT_EXPIRED_STATUS);

  useEffect(() => {
    if (!loading && !error && data) {
      data.getEventVisitorByUserClerkId.forEach((visitor) => {
        const { events } = visitor;
        const currentTime = new Date();
        const eventDateParts = events.eventDate.split("/");
        const eventDate = new Date(
          `${eventDateParts[2]}-${eventDateParts[1]}-${eventDateParts[0]}`
        );
        const endTimeParts = events.endTime.split(":");
        eventDate.setHours(
          endTimeParts[0],
          endTimeParts[1],
          endTimeParts[2] || 0
        );
        if (!events.isExpired) {
          if (eventDate < currentTime) {
            // Updating isExpired status through mutation
            updateEventExpiredStatus({
              variables: {
                id: events.id,
                isExpired: true,
              },
              // Updating cache after mutation
              update: (cache) => {
                cache.modify({
                  id: cache.identify(events),
                  fields: {
                    isExpired() {
                      return true;
                    },
                  },
                });
              },
            });
          }
        }
      });
    }
  }, [data]);

  const handlePress = (eventDetails, visitorId) => {
    navigation.navigate(RouteNames.EVENT_DETAIL_SCREEN, {
      eventDetails,
      visitorId,
    });
  };

  const renderInvitations = () => {
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;
    if (data && data.getEventVisitorByUserClerkId.length === 0) {
      return <Text>No invitations found.</Text>;
    }

    return data.getEventVisitorByUserClerkId.map((visitor) => (
      <TouchableOpacity
        key={visitor.id}
        style={styles.invitationContainer}
        onPress={() => handlePress(visitor.events, visitor.id)}
      >
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
            {visitor.events.isExpired && (
              <Text
                style={[
                  styles.eventDetail,
                  { color: COLORS.Primary, fontWeight: "bold" },
                ]}
              >
                Event Ended
              </Text>
            )}
          </View>
        </View>
        {/* <View style={styles.qrCodeContainer}>
          <QRCode
            // color={COLORS.Primary}
            enableLinearGradient={true}
            linearGradient={[COLORS.Primary, COLORS.Secondary]}
            value={visitor.id.toString()}
          />
        </View> */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: visitor.events.photo }}
            style={styles.eventImage}
          />
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Invitations</Text>
      {renderInvitations()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.space_20,
    backgroundColor: COLORS.LightGrey,
  },
  title: {
    fontSize: FONTSIZE.size_24,
    fontWeight: "bold",
    marginBottom: SPACING.space_20,
    color: COLORS.Primary,
  },
  invitationContainer: {
    marginBottom: SPACING.space_30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: SPACING.space_1,
    borderColor: COLORS.LightGrey2,
    borderRadius: BORDERRADIUS.radius_8,
    padding: SPACING.space_10,
    backgroundColor: COLORS.White,
  },
  detailsContainer: {
    flexDirection: "column",
  },
  eventName: {
    fontSize: FONTSIZE.size_20,
    fontWeight: "bold",
    marginBottom: SPACING.space_10,
    marginRight: SPACING.space_20,
    color: COLORS.DarkGrey,
  },
  eventDetailsContainer: {
    flex: 1,
  },
  eventDetail: {
    fontSize: FONTSIZE.size_16,
    marginBottom: SPACING.space_5,
    color: COLORS.DarkGrey,
  },
  qrCodeContainer: {
    alignItems: "flex-end",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDERRADIUS.radius_8,
    overflow: "hidden",
    backgroundColor: COLORS.LightGrey,
    marginVertical: SPACING.space_10,
    width: 100,
    height: 100,
  },
  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default HomeScreen;
