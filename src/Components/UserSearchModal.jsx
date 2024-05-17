import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../GraphQL/Queries";
import { AntDesign } from "@expo/vector-icons";
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from "../Common/constants";

const UserSearchModal = ({
  isVisible,
  onClose,
  selectedUsers,
  setSelectedUsers,
  currentUserEmail,
}) => {
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (data) {
      // Set users from the query result and also remove the current user email
      setUsers(
        data.getAllUsers.filter((user) => user.email !== currentUserEmail)
      );
    }
  }, [data]);

  const handleSearch = () => {
    const filteredUsers = data.getAllUsers.filter(
      (user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        user.email !== currentUserEmail
    );
    setUsers(filteredUsers);
  };

  const toggleUserSelection = (user) => {
    if (selectedUsers.includes(user.email)) {
      // If the user is already selected, remove it
      setSelectedUsers(selectedUsers.filter((email) => email !== user.email));
    } else {
      setSelectedUsers([...selectedUsers, user.email]);
    }
  };

  const handleAdd = () => {
    onClose();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        selectedUsers.includes(item.email) ? styles.selectedUserItem : {},
      ]}
      onPress={() => toggleUserSelection(item)}
    >
      <View>
        <Text style={styles.name}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Search Users</Text>
          {/* <Button title="Close" onPress={onClose} color={COLORS.Primary} /> */}
          <View style={styles.iconContainer}>
            <AntDesign
              name="close"
              size={FONTSIZE.size_24}
              color={COLORS.Primary}
              onPress={onClose}
            />
          </View>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by email"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Search" onPress={handleSearch} color={COLORS.Primary} />
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.userList}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: "center",
    padding: SPACING.space_20,
  },
  listContainer: {
    marginTop: SPACING.space_10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.space_10,
  },
  headerText: {
    fontSize: FONTSIZE.size_20,
    fontWeight: "bold",
    color: COLORS.Primary,
  },
  iconContainer: {
    backgroundColor: COLORS.IconBackground,
    borderRadius: BORDERRADIUS.radius_8,
    padding: SPACING.space_10,
  },
  searchInput: {
    borderWidth: SPACING.space_1,
    borderColor: COLORS.LightGrey2,
    padding: SPACING.space_10,
    marginBottom: SPACING.space_10,
  },
  userList: {
    flex: 1,
    marginBottom: SPACING.space_10,
  },
  userItem: {
    padding: SPACING.space_10,
    marginBottom: SPACING.space_5,
    borderWidth: SPACING.space_1,
    borderColor: COLORS.LightGrey2,
    borderRadius: BORDERRADIUS.radius_5,
  },
  selectedUserItem: {
    // backgroundColor:  COLORS.Primary,
    backgroundColor: COLORS.PrimaryAlpha,
  },
  name: {
    fontSize: FONTSIZE.size_16,
    fontWeight: "bold",
    color: COLORS.DarkGrey,
  },
  email: {
    fontSize: FONTSIZE.size_14,
    color: COLORS.MediumGrey,
  },
});

export default UserSearchModal;
