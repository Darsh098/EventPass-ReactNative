import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "@apollo/client";
import { CREATE_EVENT, CREATE_EVENT_VISITOR } from "../../GraphQL/Mutations";
import { useUser } from "@clerk/clerk-expo";

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

  const addEmail = () => {
    if (email) {
      setVisitors([...visitors, email]);
      setEmail("");
    }
  };

  const removeEmail = (index) => {
    setVisitors(visitors.filter((_, i) => i !== index));
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(false);
    setDate(currentDate);
  };

  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTime(false);
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
        placeholder="Event Date"
        value={date.toLocaleDateString()}
        onFocus={() => {
          setShowDate(true);
        }}
      />
      {/* <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => setShowDate(true)}>
          <Text
            style={[styles.input]}
          >{`Event Date: ${date.toLocaleDateString()}`}</Text>
        </TouchableOpacity> */}
      {showDate && (
        <DateTimePicker
          value={date}
          mode={"date"}
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
          style={[styles.datePicker, { width: "100%" }]}
        />
      )}
      {/* </View>
      <View style={styles.timePickerContainer}>
        <TouchableOpacity onPress={() => setShowStartTime(true)}>
          <Text
            style={styles.input}
          >{`Start Time: ${startTime.toLocaleTimeString()}`}</Text>
        </TouchableOpacity> */}
      <TextInput
        style={styles.input}
        placeholder="Start Time"
        value={startTime.toLocaleTimeString()}
        onFocus={() => setShowStartTime(true)}
      />
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
      {/* </View>
      <View style={styles.timePickerContainer}>
        <TouchableOpacity onPress={() => setShowEndTime(true)}>
          <Text
            style={styles.input}
          >{`End Time: ${endTime.toLocaleTimeString()}`}</Text>
        </TouchableOpacity> */}
      <TextInput
        style={styles.input}
        placeholder="End Time"
        value={endTime.toLocaleTimeString()}
        onFocus={() => setShowEndTime(true)}
      />
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
      {/* </View> */}
      <TextInput
        style={styles.input}
        placeholder="Number Of Entries"
        keyboardType="numeric"
        onChangeText={setEntriesCount}
        value={entriesCount}
        maxLength={3}
      />
      <TextInput
        style={styles.input}
        placeholder="Photo URL"
        value={photo}
        onChangeText={setPhoto}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Email"
        value={visitors.join(", ")} // Join the array into a string
        onChangeText={(text) => setVisitors(text.split(", "))} // Split the string into an array
      /> */}
      {/* For Allowing Multiple Emails */}
      <TouchableOpacity style={styles.emailContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <Button title="Add" onPress={addEmail} />
      </TouchableOpacity>
      {visitors.map((email, index) => (
        <View key={index} style={styles.emailContainer}>
          <Text style={styles.email}>{email}</Text>
          <TouchableOpacity onPress={() => removeEmail(index)}>
            <Text style={styles.remove}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Create Event" onPress={handleCreateEvent} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  datePicker: {
    width: "100%",
  },
  timePicker: {
    width: "100%",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  email: {
    flex: 1,
    padding: 10,
  },
  remove: {
    color: "red",
    padding: 10,
  },
});

export default CreateEventScreen;
