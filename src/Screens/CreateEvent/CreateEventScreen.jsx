import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Button,
  Input,
  Avatar,
  Card,
  Icon,
  Overlay,
} from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "@apollo/client";
import { CREATE_EVENT, CREATE_EVENT_VISITOR } from "../../GraphQL/Mutations";
import { useUser } from "@clerk/clerk-expo";
import UserSearchModal from "../../Components/UserSearchModal";
import { firebase } from "../../../config";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import {
  BORDERRADIUS,
  COLORS,
  FONTSIZE,
  RouteNames,
  SPACING,
} from "../../Common/constants";
import Loader from "../../Components/Loader";

const CreateEventScreen = () => {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [entriesCount, setEntriesCount] = useState("");
  const [photo, setPhoto] = useState(
    "https://firebasestorage.googleapis.com/v0/b/eventpass-84cb8.appspot.com/o/futuristic-view-school-classroom-with-state-art-architecture.jpg?alt=media&token=18a6967f-4f3a-4f9d-8b53-c2b03521af91"
  );
  const [createEvent] = useMutation(CREATE_EVENT);
  const [createEventVisitor] = useMutation(CREATE_EVENT_VISITOR);

  const [image, setImage] = useState(null);
  const [showDate, setShowDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [venueError, setVenueError] = useState("");
  const [entriesCountError, setEntriesCountError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadMedia(result.assets[0].uri);
    }
  };

  const uploadMedia = async (img) => {
    setUploading(true);
    setLoading(true);
    try {
      if (!img) {
        console.error("Image URI is null or undefined");
        setUploading(false);
        setLoading(false);
        return;
      }

      const { uri } = await FileSystem.getInfoAsync(img);
      const response = await fetch(uri);
      const blob = await response.blob();

      const filename = img.substring(img.lastIndexOf("/") + 1);
      const ref = firebase.storage().ref().child(filename);

      await ref.put(blob);
      const downloadURL = await ref.getDownloadURL();
      setImage(null);
      setPhoto(downloadURL);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      setLoading(false);
    }
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

    const entriesCountInt = parseInt(entriesCount, 10);
    if (isNaN(entriesCountInt) || entriesCountInt < 1 || entriesCountInt > 10) {
      setEntriesCountError("Entries count must be between 1 and 10");
      valid = false;
    } else {
      setEntriesCountError("");
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

  const handleCreateEvent = async () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);

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
              eventId: data.createEvent.id,
              email: email,
            },
          });
        }
      }
      resetFields();
      navigation.navigate(RouteNames.PROFILE_SCREEN);
    } catch (error) {
      console.error("Error Registering Event:", error);
    } finally {
      setLoading(false);
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
    setPhoto(
      "https://firebasestorage.googleapis.com/v0/b/eventpass-84cb8.appspot.com/o/futuristic-view-school-classroom-with-state-art-architecture.jpg?alt=media&token=18a6967f-4f3a-4f9d-8b53-c2b03521af91"
    );
    setShowDate(false);
    setShowStartTime(false);
    setShowEndTime(false);
    setIsModalVisible(false);
    setVisitors([]);
  };

  const calculateDurationInMinutes = (startTime, endTime) => {
    const start = startTime.getHours() * 60 + startTime.getMinutes();
    const end = endTime.getHours() * 60 + endTime.getMinutes();
    return end - start;
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(false);
    setDate(currentDate);
  };

  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTime(false);
    // setShowEndTime(true);
    setStartTime(currentTime);
  };

  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndTime(false);
    setEndTime(currentTime);
  };

  return (
    <>
      {loading && <Loader />}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create New Event</Text>

        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          <Avatar
            size="xlarge"
            source={{ uri: photo }}
            icon={{ name: "camera", type: "font-awesome" }}
            overlayContainerStyle={styles.avatar}
          />
        </TouchableOpacity>

        <Card containerStyle={styles.card}>
          <Input
            placeholder="Event Name"
            value={name}
            onChangeText={setName}
            leftIcon={
              <Icon
                name="event"
                size={FONTSIZE.size_24}
                color={COLORS.Primary}
              />
            }
            errorMessage={nameError}
            maxLength={30}
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
            errorMessage={descriptionError}
            maxLength={150}
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
            errorMessage={venueError}
            maxLength={100}
          />
          <Input
            placeholder="Number of Entries"
            value={entriesCount}
            onChangeText={setEntriesCount}
            keyboardType="numeric"
            leftIcon={
              <Icon
                name="group"
                size={FONTSIZE.size_24}
                color={COLORS.Primary}
              />
            }
            errorMessage={entriesCountError}
            maxLength={2}
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
            mode="date"
            is24Hour={true}
            display="default"
            minimumDate={new Date()}
            onChange={onChangeDate}
          />
        )}

        {showStartTime && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeStartTime}
          />
        )}

        {showEndTime && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeEndTime}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Create"
            onPress={handleCreateEvent}
            buttonStyle={styles.createButton}
          />
          <Button
            title="Clear"
            onPress={resetFields}
            buttonStyle={styles.cancelButton}
          />
        </View>

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
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: SPACING.space_10,
  },
  avatar: {
    backgroundColor: COLORS.IconBackground,
    borderWidth: SPACING.space_2,
    borderRadius: BORDERRADIUS.radius_10,
    borderColor: COLORS.Primary,
  },
  card: {
    borderRadius: BORDERRADIUS.radius_10,
    paddingVertical: SPACING.space_20,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: SPACING.space_20,
  },
  icon: {
    padding: SPACING.space_20,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    // marginTop: SPACING.space_20,
  },
  createButton: {
    backgroundColor: COLORS.Primary,
    marginHorizontal: SPACING.space_20,
    marginVertical: SPACING.space_20,
  },
  cancelButton: {
    backgroundColor: COLORS.Red2,
    marginHorizontal: SPACING.space_20,
  },
});

export default CreateEventScreen;
