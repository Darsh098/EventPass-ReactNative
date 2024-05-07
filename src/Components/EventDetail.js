// EventDetail.js
import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Entypo } from "@expo/vector-icons";

const COLORS = {
  primary: "#5E63E9",
  secondary: "#AEB2E5",
  background: "#f0f0f0",
  text: "#333",
};

const EventDetail = ({ route }) => {
  const { eventDetails, visitorId } = route.params;

  const handleSaveQRCode = () => {};

  const eventHasEnded = eventDetails.isExpired;

  return (
    <View style={styles.container}>
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
          linearGradient={[COLORS.primary, COLORS.secondary]}
        />
        <TouchableOpacity onPress={handleSaveQRCode} style={styles.saveButton}>
          <Entypo name="download" size={24} color={COLORS.primary} />
          <Text style={styles.saveButtonText}>Save QR Code</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
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
          <Text style={styles.detailLabel}>Scans Remaining:</Text>
          <Text style={styles.detailValue}>{eventDetails.entriesCount}</Text>
        </View>
        <View style={styles.detailRow}>
          {/* Render "Event Ended" message with icon and background color */}
          {eventHasEnded && (
            <View style={styles.eventEndedContainer}>
              <Entypo name="info-with-circle" size={24} color="red" />
              <Text style={styles.eventEndedText}>Event Ended</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 20,
  },
  eventName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  organizer: {
    fontSize: 16,
    color: COLORS.text,
  },
  qrCodeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8E8E8",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    marginLeft: 5,
    color: COLORS.primary,
  },
  detailsContainer: {},
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
  eventEndedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFCDD2",
    padding: 10,
    borderRadius: 8,
  },
  eventEndedText: {
    marginLeft: 10,
    color: "red",
  },
});

export default EventDetail;
