import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "@apollo/client";
import {
  CREATE_EVENT_VISITOR,
  DELETE_EVENT_VISITOR,
  UPDATE_EVENT,
} from "../../GraphQL/Mutations";
import { useUser } from "@clerk/clerk-expo";
import UserSearchModal from "../../Components/UserSearchModal";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const EditEventScreen = ({ route, navigation }) => {
  const { user } = useUser();
  const { eventDetails } = route.params;

  const [name, setName] = useState(eventDetails.name);
  const [description, setDescription] = useState(eventDetails.description);
  const [venue, setVenue] = useState(eventDetails.venue);
  const [entriesCount, setEntriesCount] = useState(
    eventDetails.entriesCount.toString()
  );
  const [photo, setPhoto] = useState(eventDetails.photo);
  const [showDate, setShowDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [updateEvent, { error }] = useMutation(UPDATE_EVENT);
  const [deleteEventVisitor] = useMutation(DELETE_EVENT_VISITOR);
  const [createEventVisitor] = useMutation(CREATE_EVENT_VISITOR);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const extractVisitorEmails = () => {
      if (eventDetails.eventVisitors && eventDetails.eventVisitors.length > 0) {
        const emails = eventDetails.eventVisitors.map(
          (vis) => vis.visitor.email
        );
        return emails;
      }
      return [];
    };
    setVisitors(extractVisitorEmails());
  }, [eventDetails]);

  useEffect(() => {
    const formatDateAndTime = (eDate, eTime) => {
      const [day, month, year] = eDate.split("/");
      const [hour, minute, second] = (eTime || "00:00:00").split(":");
      return new Date(year, month - 1, day, hour, minute, second);
    };

    const eventDate = formatDateAndTime(
      eventDetails.eventDate,
      eventDetails.startTime
    );
    setDate(eventDate);
    setStartTime(eventDate);
    setEndTime(formatDateAndTime(eventDetails.eventDate, eventDetails.endTime));
  }, [eventDetails]);

  const calculateDurationInMinutes = (startTime, endTime) => {
    const start = startTime.getHours() * 60 + startTime.getMinutes();
    const end = endTime.getHours() * 60 + endTime.getMinutes();

    const durationInMinutes = end - start;

    return durationInMinutes;
  };

  const handleSaveChanges = async () => {
    try {
      const existingVisitorEmails = eventDetails.eventVisitors.map(
        (vis) => vis.visitor.email
      );

      const newVisitorEmails = visitors.filter(
        (visitor) => !existingVisitorEmails.includes(visitor)
      );

      const removedVisitorEmails = existingVisitorEmails.filter(
        (email) => !visitors.includes(email)
      );

      // Removing visitors that are no longer present
      if (removedVisitorEmails.length > 0) {
        for (const email of removedVisitorEmails) {
          await deleteEventVisitor({
            variables: {
              id: eventDetails.id,
              email: email,
            },
          });
        }
      }

      // Adding new visitors
      if (newVisitorEmails.length > 0) {
        for (const email of newVisitorEmails) {
          await createEventVisitor({
            variables: {
              eventId: eventDetails.id,
              email: email,
            },
          });
        }
      }

      await updateEvent({
        variables: {
          id: eventDetails.id,
          name: name,
          description: description,
          venue: venue,
          eventDate: date.toLocaleDateString(),
          startTime: startTime.toLocaleTimeString(),
          endTime: endTime.toLocaleTimeString(),
          timeDuration: calculateDurationInMinutes(startTime, endTime),
          entriesCount: parseInt(entriesCount),
        },
      });

      navigation.navigate("MyProfile");
    } catch (err) {
      console.error("Error updating event:", error.networkError.result);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDate(false);
    setDate(currentDate);
  };

  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowStartTime(false);
    setStartTime(currentTime);
    setShowEndTime(true);
  };

  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowEndTime(false);
    setEndTime(currentTime);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Venue"
        value={venue}
        onChangeText={setVenue}
      />
      <TextInput
        style={styles.input}
        placeholder="Number Of Entries"
        keyboardType="numeric"
        onChangeText={setEntriesCount}
        value={entriesCount}
        maxLength={3}
      />
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowDate(true)}
        >
          <AntDesign name="calendar" size={24} color="#5E63E9" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowStartTime(true)}
        >
          <Entypo name="time-slot" size={24} color="#5E63E9" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsModalVisible(true)}
        >
          <AntDesign name="addusergroup" size={24} color="#5E63E9" />
        </TouchableOpacity>
      </View>
      {showDate && (
        <DateTimePicker
          value={date}
          mode={"date"}
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
          style={styles.datePicker}
        />
      )}
      {showStartTime && (
        <DateTimePicker
          value={startTime}
          mode={"time"}
          is24Hour={true}
          display="default"
          onChange={onChangeStartTime}
          style={styles.timePicker}
        />
      )}
      {showEndTime && (
        <DateTimePicker
          value={endTime}
          mode={"time"}
          is24Hour={true}
          display="default"
          onChange={onChangeEndTime}
          style={styles.timePicker}
        />
      )}
      <Button title="Save Changes" onPress={handleSaveChanges} />
      <UserSearchModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        selectedUsers={visitors}
        setSelectedUsers={setVisitors}
        currentUserEmail={user.primaryEmailAddress.emailAddress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#5E63E9",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  iconButton: {
    padding: 10,
    backgroundColor: "#E8E8E8",
    borderRadius: 8,
  },
  datePicker: {
    width: "100%",
  },
  timePicker: {
    width: "100%",
  },
});

export default EditEventScreen;
