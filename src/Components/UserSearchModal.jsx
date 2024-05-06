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
          {/* <Button title="Close" onPress={onClose} color="#5E63E9" /> */}
          <View style={styles.iconContainer}>
            <AntDesign
              name="close"
              size={24}
              color="#5E63E9"
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
        <Button title="Search" onPress={handleSearch} color="#5E63E9" />
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
    padding: 20,
  },
  listContainer: {
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5E63E9",
  },
  iconContainer: {
    backgroundColor: "#E8E8E8",
    borderRadius: 8,
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  userList: {
    flex: 1,
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  selectedUserItem: {
    // backgroundColor: "#5E63E9",
    backgroundColor: "rgba(94, 99, 233, 0.2)",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
});

export default UserSearchModal;
