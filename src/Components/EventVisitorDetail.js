import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { DELETE_EVENT } from "../GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import {
  BORDERRADIUS,
  COLORS,
  FONTSIZE,
  RouteNames,
  SPACING,
} from "../Common/constants";

const EventVisitorsDetail = ({ route }) => {
  const { eventDetails } = route.params;
  const [deleteEvent] = useMutation(DELETE_EVENT);
  const navigation = useNavigation();

  const confirmDeleteEvent = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => handleDeleteEvent() },
      ],
      { cancelable: false }
    );
  };

  const handleEditEvent = () => {
    navigation.navigate(RouteNames.EDIT_EVENT_SCREEN, {
      eventDetails: eventDetails,
    });
  };
  const handleDeleteEvent = async () => {
    await deleteEvent({
      variables: {
        id: eventDetails.id,
      },
    });
    navigation.navigate(RouteNames.PROFILE_SCREEN);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.eventName}>{eventDetails.name}</Text>
          <Text style={styles.organizer}>
            Organized by {eventDetails.organizer.firstName}{" "}
            {eventDetails.organizer.lastName}
          </Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={handleEditEvent}>
            <View style={styles.iconButton}>
              <Entypo
                name="edit"
                size={FONTSIZE.size_24}
                color={COLORS.Primary}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDeleteEvent}>
            <View style={styles.iconButton}>
              <MaterialIcons
                name="delete"
                size={FONTSIZE.size_24}
                color={COLORS.Red2}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Image source={{ uri: eventDetails.photo }} style={styles.eventPhoto} />
      <LinearGradient
        colors={[COLORS.Gradient1, COLORS.Gradient2]}
        style={styles.gradientCard}
      >
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Description:</Text>
          <Text style={styles.detailValue}>{eventDetails.description}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Venue:</Text>
          <Text style={styles.detailValue}>{eventDetails.venue}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{eventDetails.eventDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time:</Text>
          <Text style={styles.detailValue}>
            {eventDetails.startTime} - {eventDetails.endTime}
          </Text>
        </View>
      </LinearGradient>

      {eventDetails.isExpired && (
        <View style={styles.detailRow}>
          <View style={styles.eventEndedContainer}>
            <Entypo
              name="info-with-circle"
              size={FONTSIZE.size_24}
              color={COLORS.Red}
            />
            <Text style={styles.eventEndedText}>Event Ended</Text>
          </View>
        </View>
      )}

      <View style={styles.visitorsContainer}>
        <Text style={styles.visitorsTitle}>Invited Visitors</Text>
        {/* Rendering the list of invited visitors here */}
        {eventDetails.eventVisitors.map((visitor, index) => (
          <LinearGradient
            key={index}
            colors={[COLORS.Gradient1, COLORS.Gradient2]}
            style={[
              styles.gradientCard,
              { flexDirection: "row", alignItems: "center" },
            ]}
          >
            <Image
              source={{ uri: visitor.visitor.profilePhoto }}
              style={styles.visitorPhoto}
            />
            <Text style={styles.visitorName}>
              {visitor.visitor.firstName} {visitor.visitor.lastName}
            </Text>
          </LinearGradient>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.LightGrey,
    paddingHorizontal: SPACING.space_20,
    paddingTop: SPACING.space_40,
    paddingBottom: SPACING.space_20,
  },
  headerContainer: {
    marginBottom: SPACING.space_20,
  },
  iconsContainer: {
    flexDirection: "row",
    marginTop: SPACING.space_10,
  },
  iconButton: {
    backgroundColor: COLORS.IconBackground,
    borderRadius: BORDERRADIUS.radius_8,
    padding: SPACING.space_10,
    marginRight: SPACING.space_10,
  },
  header: {
    marginBottom: SPACING.space_20,
  },
  editIcon: {
    backgroundColor: COLORS.IconBackground,
    borderRadius: 8,
    padding: SPACING.space_10,
  },
  eventName: {
    fontSize: FONTSIZE.size_24,
    fontWeight: "bold",
    color: COLORS.Primary,
    marginBottom: SPACING.space_10,
  },
  organizer: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.DarkGrey,
  },
  eventPhoto: {
    width: "100%",
    height: 200,
    borderRadius: BORDERRADIUS.radius_8,
    marginBottom: SPACING.space_20,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: SPACING.space_15,
  },
  detailLabel: {
    width: 150,
    fontWeight: "bold",
    color: COLORS.Primary,
  },
  detailValue: {
    flex: 1,
    color: COLORS.DarkGrey,
  },
  visitorsContainer: {
    marginTop: SPACING.space_20,
  },
  visitorsTitle: {
    fontSize: SPACING.space_20,
    fontWeight: "bold",
    marginBottom: SPACING.space_10,
    color: COLORS.Primary,
  },
  visitorPhoto: {
    width: SPACING.space_28,
    height: SPACING.space_28,
    borderRadius: BORDERRADIUS.radius_20,
    marginRight: SPACING.space_10,
  },
  gradientCard: {
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_8,
    marginBottom: SPACING.space_10,
    shadowColor: COLORS.Black,
    shadowOffset: {
      width: SPACING.space_0,
      height: SPACING.space_2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  visitorName: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.Primary,
  },
  eventEndedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.Red3,
    padding: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_8,
    marginBottom: SPACING.space_10,
  },
  eventEndedText: {
    marginLeft: SPACING.space_10,
    color: COLORS.Red,
  },
});

export default EventVisitorsDetail;
