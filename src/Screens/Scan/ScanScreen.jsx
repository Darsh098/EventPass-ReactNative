import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { BarCodeScanner } from "expo-barcode-scanner";
import { GET_EVENT_VISITOR_BY_ID } from "../../GraphQL/Queries";
import { useLazyQuery } from "@apollo/client";

export default ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanData, setScanData] = useState("");
  const [openScanner, setOpenScanner] = useState(false);
  const [getEventVisitor, { loading, data, error }] = useLazyQuery(
    GET_EVENT_VISITOR_BY_ID
  );

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Please grant camera permissions to the app.</Text>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanData(data);
    setOpenScanner(false);
    getEventVisitor({ variables: { id: parseInt(data) } });
  };

  return (
    <View style={styles.container}>
      {openScanner ? (
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
        />
      ) : (
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              {data && data.getEventVisitorById ? (
                <>
                  <Text style={styles.scanData}>
                    Event Name: {data.getEventVisitorById.events.name}
                  </Text>
                  <Text style={styles.scanData}>
                    Organizer:
                    {data.getEventVisitorById.events.organizer.firstName}
                  </Text>
                  <Text style={styles.scanData}>
                    Visitor: {data.getEventVisitorById.visitor.firstName}
                  </Text>
                  {/* Render other details here */}
                </>
              ) : (
                ""
              )}
              <Button
                title="Scan QR"
                onPress={() => {
                  setScanData("");
                  setOpenScanner(true);
                }}
              />
            </>
          )}
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scanData: {
    fontSize: 20,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 20,
    marginBottom: 20,
    color: "red",
  },
});
