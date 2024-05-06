import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "@apollo/client";
import { CREATE_EVENT, CREATE_EVENT_VISITOR } from "../../GraphQL/Mutations";
import { useUser } from "@clerk/clerk-expo";
import UserSearchModal from "../../Components/UserSearchModal";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const CreateEventScreen = () => {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [entriesCount, setEntriesCount] = useState("");
  const [photo, setPhoto] = useState("");
  const [showDate, setShowDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [email, setEmail] = useState("");
  const [visitors, setVisitors] = useState([]);
  const [createEvent] = useMutation(CREATE_EVENT);
  const [createEventVisitor] = useMutation(CREATE_EVENT_VISITOR);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // To Check Which Are The Visitors Selected
  // useEffect(() => {
  //   console.log(visitors);
  // }, [visitors]);

  const handleCreateEvent = async () => {
    try {
      const timeDuration = calculateDurationInMinutes(startTime, endTime);
      const { data } = await createEvent({
        variables: {
          name: name,
          description: description,
          venue: venue,
          eventDate: date.toLocaleDateString(),
          startTime: startTime.toLocaleTimeString(),
          endTime: endTime.toLocaleTimeString(),
          timeDuration: timeDuration,
          entriesCount: parseInt(entriesCount),
          organizerClerkId: user.id,
          photo: photo,
        },
      });

      if (data && data.createEvent) {
        for (const email of visitors) {
          await createEventVisitor({
            variables: {
              QR_code: "null",
              eventId: data.createEvent.id,
              email: email,
            },
          });
        }
      }
      resetFields();
    } catch (error) {
      console.error("Error Registering Event:", error);
    }
  };

  const resetFields = () => {
    setName("");
    setDescription("");
    setVenue("");
    setDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
    setEntriesCount("");
    setPhoto("");
    setShowDate(false);
    setShowStartTime(false);
    setShowEndTime(false);
    setEmail("");
    setIsModalVisible(false);
    setVisitors([]);
  };

  const calculateDurationInMinutes = (startTime, endTime) => {
    // Convert start and end time to milliseconds since midnight
    const start = startTime.getHours() * 60 + startTime.getMinutes();
    const end = endTime.getHours() * 60 + endTime.getMinutes();

    // Calculate the difference in minutes
    const durationInMinutes = end - start;

    return durationInMinutes;
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(false);
    setDate(currentDate);
  };

  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTime(false);
    // Show The End Time Immediately show it will be shown as effect of choosing time slot
    setShowEndTime(true);
    setStartTime(currentTime);
  };

  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndTime(false);
    setEndTime(currentTime);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Event</Text>
      {/* Input fields */}
      <View style={styles.inputContainer}>
        {/* Name */}
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        {/* Description */}
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        {/* Venue */}
        <TextInput
          style={styles.input}
          placeholder="Venue"
          value={venue}
          onChangeText={setVenue}
        />
        {/* Number of Entries */}
        <TextInput
          style={styles.input}
          placeholder="Number Of Entries"
          keyboardType="numeric"
          onChangeText={setEntriesCount}
          value={entriesCount}
          maxLength={3}
        />
        {/* Photo URL */}
        <TextInput
          style={styles.input}
          placeholder="Photo URL"
          value={photo}
          onChangeText={setPhoto}
        />
      </View>

      {/* Date, Time, Add Visitor Icons */}
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

      {/* Date Picker */}
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

      {/* Start Time Picker */}
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

      {/* End Time Picker */}
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

      {/* Create and Cancel Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Create" onPress={handleCreateEvent} />
        <Button
          title="Cancel"
          color="#FF6961"
          onPress={resetFields}
          style={styles.cancelButton}
        />
      </View>

      {/* User Search Modal */}
      <UserSearchModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        selectedUsers={visitors}
        setSelectedUsers={setVisitors}
        currentUserEmail={user.primaryEmailAddress.emailAddress}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#5E63E9",
  },
  inputContainer: {
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    marginLeft: 10,
  },
});

export default CreateEventScreen;
