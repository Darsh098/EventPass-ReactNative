import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { DELETE_EVENT } from "../GraphQL/Mutations";
import { useMutation } from "@apollo/client";

const COLORS = {
  primary: "#5E63E9",
  text: "#333",
  background: "#f0f0f0",
  danger: "#FF6961",
};

const EventVisitorsDetail = ({ route }) => {
  const { eventDetails } = route.params;
  const [deleteEvent] = useMutation(DELETE_EVENT);
  const navigation = useNavigation();

  const handleEditEvent = () => {
    navigation.navigate("EditEvent", { eventDetails: eventDetails });
  };
  const handleDeleteEvent = async () => {
    await deleteEvent({
      variables: {
        id: eventDetails.id,
      },
    });
    navigation.navigate("MyProfile");
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
              <Entypo name="edit" size={24} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteEvent}>
            <View style={styles.iconButton}>
              <MaterialIcons name="delete" size={24} color={COLORS.danger} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Image source={{ uri: eventDetails.photo }} style={styles.eventPhoto} />
      <LinearGradient
        colors={["#D5DBFF", "#EFE9FF"]}
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
            <Entypo name="info-with-circle" size={24} color="red" />
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
            colors={["#D5DBFF", "#EFE9FF"]}
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
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  iconsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  iconButton: {
    backgroundColor: "#E8E8E8",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  header: {
    marginBottom: 20,
  },
  editIcon: {
    backgroundColor: "#E8E8E8",
    borderRadius: 8,
    padding: 10,
  },
  eventName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  organizer: {
    fontSize: 16,
    color: COLORS.text,
  },
  eventPhoto: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  detailLabel: {
    width: 150,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  detailValue: {
    flex: 1,
    color: COLORS.text,
  },
  visitorsContainer: {
    marginTop: 20,
  },
  visitorsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.primary,
  },
  visitorPhoto: {
    width: 28,
    height: 28,
    borderRadius: 20,
    marginRight: 10,
  },
  gradientCard: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  visitorName: {
    fontSize: 16,
    color: COLORS.primary,
  },
  eventEndedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFCDD2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventEndedText: {
    marginLeft: 10,
    color: "red",
  },
});

export default EventVisitorsDetail;
