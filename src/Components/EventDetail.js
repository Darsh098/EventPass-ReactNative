import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from "../Common/constants";

const EventDetail = ({ route }) => {
  const { eventDetails, visitorId } = route.params;

  // Functionality To Save The QR Code To Gallery
  // const handleSaveQRCode = async () => {};

  const eventHasEnded = eventDetails.isExpired;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.eventName}>{eventDetails.name}</Text>
          <Text style={styles.organizer}>
            Organized by {eventDetails.organizer.firstName}{" "}
            {eventDetails.organizer.lastName}
          </Text>
        </View>
        <View style={styles.qrCodeContainer}>
          <QRCode
            value={visitorId.toString()}
            enableLinearGradient={true}
            linearGradient={[COLORS.Primary, COLORS.Secondary]}
          />
          {/* <TouchableOpacity
            onPress={handleSaveQRCode}
            style={styles.saveButton}
          >
            <Entypo name="download" size={24} color={COLORS.Primary} />
            <Text style={styles.saveButtonText}>Save QR Code</Text>
          </TouchableOpacity> */}
        </View>
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
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Scans Allowed:</Text>
            <Text style={styles.detailValue}>{eventDetails.entriesCount}</Text>
          </View>
          <View style={styles.detailRow}>
            {/* Render "Event Ended" message with icon and background color */}
            {eventHasEnded && (
              <View style={styles.eventEndedContainer}>
                <Entypo
                  name="info-with-circle"
                  size={FONTSIZE.size_24}
                  color={COLORS.Red}
                />
                <Text style={styles.eventEndedText}>Event Ended</Text>
              </View>
            )}
          </View>
        </LinearGradient>
        <Image source={{ uri: eventDetails.photo }} style={styles.eventPhoto} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LightGrey,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.space_20,
    paddingTop: SPACING.space_40,
  },
  header: {
    marginBottom: SPACING.space_20,
  },
  eventName: {
    fontSize: FONTSIZE.size_24,
    fontWeight: "bold",
    color: COLORS.Primary,
  },
  organizer: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.DarkGrey,
  },
  qrCodeContainer: {
    alignItems: "center",
    marginBottom: SPACING.space_20,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.IconBackground,
    padding: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_8,
    marginTop: SPACING.space_10,
  },
  saveButtonText: {
    marginLeft: SPACING.space_5,
    color: COLORS.Primary,
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
  eventEndedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.Red3,
    padding: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_8,
  },
  eventEndedText: {
    marginLeft: SPACING.space_10,
    color: COLORS.Red,
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
  eventPhoto: {
    width: "100%",
    height: 200, // Adjust height as needed
    borderRadius: BORDERRADIUS.radius_8,
    marginBottom: SPACING.space_20,
  },
});

export default EventDetail;
