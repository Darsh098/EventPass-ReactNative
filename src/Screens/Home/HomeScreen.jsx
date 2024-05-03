import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useQuery } from "@apollo/client";
import QRCode from "react-native-qrcode-svg";
import { GET_EVENT_VISITOR_BY_USER_CLERK_ID } from "../../GraphQL/Queries";
import { useUser } from "@clerk/clerk-expo";

const HomeScreen = ({ params }) => {
  const { user } = useUser();
  const [qrCodes, setQrCodes] = useState([]);

  const { loading, error, data } = useQuery(
    GET_EVENT_VISITOR_BY_USER_CLERK_ID,
    {
      variables: { clerkId: user.id },
    }
  );

  useEffect(() => {
    if (data && data.getEventVisitorByUserClerkId) {
      const eventVisitors = data.getEventVisitorByUserClerkId;
      const qrCodes = eventVisitors.map((visitor) => {
        return (
          <View key={visitor.id} style={styles.qrCodeContainer}>
            <Text>{visitor.events.name}</Text>
            <QRCode value={visitor.id.toString()} />
          </View>
        );
      });
      setQrCodes(qrCodes);
    }
  }, [data]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      {qrCodes.length > 0 ? qrCodes : <Text>No Invitations</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qrCodeContainer: {
    marginBottom: 20,
  },
});

export default HomeScreen;
