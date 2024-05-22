import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Button, Input, Card, Icon } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "@apollo/client";
import {
  CREATE_EVENT_VISITOR,
  DELETE_EVENT_VISITOR,
  UPDATE_EVENT,
} from "../../GraphQL/Mutations";
import { useUser } from "@clerk/clerk-expo";
import UserSearchModal from "../../Components/UserSearchModal";
import {
  BORDERRADIUS,
  COLORS,
  FONTSIZE,
  RouteNames,
  SPACING,
} from "../../Common/constants";
import Loader from "../../Components/Loader";

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
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [venueError, setVenueError] = useState("");
  const [entriesCountError, setEntriesCountError] = useState("");
  const [updateEvent, { error }] = useMutation(UPDATE_EVENT);
  const [deleteEventVisitor] = useMutation(DELETE_EVENT_VISITOR);
  const [createEventVisitor] = useMutation(CREATE_EVENT_VISITOR);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const validateFields = () => {
    let valid = true;
    if (name.length === 0) {
      setNameError("Event name is required");
      valid = false;
    } else if (name.length > 30) {
      setNameError("Event name cannot exceed 30 characters");
      valid = false;
    } else {
      setNameError("");
    }

    if (description.length === 0) {
      setDescriptionError("Description is required");
      valid = false;
    } else if (description.length > 150) {
      setDescriptionError("Description cannot exceed 150 characters");
      valid = false;
    } else {
      setDescriptionError("");
    }

    if (venue.length === 0) {
      setVenueError("Venue is required");
      valid = false;
    } else if (venue.length > 100) {
      setVenueError("Venue cannot exceed 100 characters");
      valid = false;
    } else {
      setVenueError("");
    }

    const timeDuration = calculateDurationInMinutes(startTime, endTime);
    if (timeDuration <= 0) {
      Alert.alert(
        "Validation Error",
        "Please choose an end time later than the start time."
      );
      valid = false;
    }

    return valid;
  };

  const handleSaveChanges = async () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);

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

      navigation.navigate(RouteNames.PROFILE_SCREEN);
    } catch (err) {
      console.error("Error updating event:", error.networkError.result);
    } finally {
      setLoading(false);
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
  };

  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowEndTime(false);
    setEndTime(currentTime);
  };

  return (
    <>
      {loading && <Loader />}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Event</Text>
        <Card containerStyle={styles.card}>
          <Input
            placeholder="Name"
            value={name}
            onChangeText={setName}
            leftIcon={
              <Icon
                name="event"
                size={FONTSIZE.size_24}
                color={COLORS.Primary}
              />
            }
            maxLength={30}
            errorMessage={nameError}
          />
          <Input
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            leftIcon={
              <Icon
                name="description"
                size={FONTSIZE.size_24}
                color={COLORS.Primary}
              />
            }
            multiline
            maxLength={150}
            errorMessage={descriptionError}
          />
          <Input
            placeholder="Venue"
            value={venue}
            onChangeText={setVenue}
            leftIcon={
              <Icon
                name="location-on"
                size={FONTSIZE.size_24}
                color={COLORS.Primary}
              />
            }
            maxLength={100}
            errorMessage={venueError}
          />

          <TouchableOpacity onPress={() => setShowDate(true)}>
            <Input
              placeholder="Event Date"
              value={date.toLocaleDateString()}
              editable={false}
              leftIcon={
                <Icon
                  name="calendar-month"
                  type="material-community"
                  size={FONTSIZE.size_24}
                  color={COLORS.Primary}
                />
              }
            />
          </TouchableOpacity>
          <View style={styles.timeContainer}>
            <TouchableOpacity
              onPress={() => setShowStartTime(true)}
              style={styles.timeInput}
            >
              <Input
                placeholder="Start Time"
                value={startTime.toLocaleTimeString()}
                editable={false}
                leftIcon={
                  <Icon
                    name="timer"
                    type="material-community"
                    size={FONTSIZE.size_24}
                    color={COLORS.Primary}
                  />
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowEndTime(true)}
              style={styles.timeInput}
            >
              <Input
                placeholder="End Time"
                value={endTime.toLocaleTimeString()}
                editable={false}
                leftIcon={
                  <Icon
                    name="timer-off"
                    type="material-community"
                    size={FONTSIZE.size_24}
                    color={COLORS.Primary}
                  />
                }
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Input
              placeholder="Add Visitors"
              value={`${visitors.length} invited`}
              editable={false}
              leftIcon={
                <Icon
                  name="account-multiple-plus"
                  type="material-community"
                  color={COLORS.Primary}
                  size={FONTSIZE.size_24}
                />
              }
              inputStyle={styles.visitorInput}
            />
          </TouchableOpacity>
        </Card>

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
        <Button
          title="Save Changes"
          buttonStyle={styles.editButton}
          onPress={handleSaveChanges}
        />

        <UserSearchModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          selectedUsers={visitors}
          setSelectedUsers={setVisitors}
          currentUserEmail={user.primaryEmailAddress.emailAddress}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_10,
    backgroundColor: COLORS.LightGrey,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeInput: {
    flex: 1,
    marginHorizontal: SPACING.space_5,
  },
  title: {
    fontSize: FONTSIZE.size_24,
    fontWeight: "bold",
    color: COLORS.Primary,
    marginHorizontal: SPACING.space_20,
    marginVertical: SPACING.space_10,
  },
  card: {
    borderRadius: BORDERRADIUS.radius_10,
    paddingVertical: SPACING.space_20,
  },
  input: {
    width: "100%",
    borderWidth: SPACING.space_1,
    borderColor: COLORS.GreyColor,
    borderRadius: BORDERRADIUS.radius_8,
    padding: SPACING.space_10,
    marginBottom: SPACING.space_10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: SPACING.space_20,
  },
  icon: {
    padding: SPACING.space_10,
  },
  iconButton: {
    padding: SPACING.space_10,
    backgroundColor: COLORS.IconBackground,
    borderRadius: BORDERRADIUS.radius_8,
  },
  datePicker: {
    width: "100%",
  },
  timePicker: {
    width: "100%",
  },
  editButton: {
    backgroundColor: COLORS.Primary,
    marginHorizontal: SPACING.space_20,
    marginVertical: SPACING.space_20,
  },
});

export default EditEventScreen;
