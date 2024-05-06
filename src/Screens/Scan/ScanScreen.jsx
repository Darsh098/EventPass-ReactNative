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
import BarcodeMask from "react-native-barcode-mask";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
        <>
          <BarCodeScanner
            style={StyleSheet.absoluteFillObject}
            onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
          >
            <BarcodeMask
              edgeColor="#5E63E9"
              animatedLineColor="#5E63E9"
              edgeRadius={14}
              edgeBorderWidth={8}
              width={250}
              height={250}
              lineAnimationDuration={1000}
              showAnimatedLine
            />
            <View style={styles.iconContainer}>
              <AntDesign
                name="close"
                size={24}
                color="#5E63E9"
                onPress={() => setOpenScanner(false)}
              />
            </View>
          </BarCodeScanner>
        </>
      ) : (
        <>
          <View style={styles.contentContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                {data && data.getEventVisitorById ? (
                  <>
                    <Text style={styles.scanData}>
                      {data.getEventVisitorById.events.name}
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
                ) : error ? (
                  <Text style={styles.errorText}>Invalid QR</Text>
                ) : (
                  <Text style={styles.scanData}>Scan The QR</Text>
                )}
              </>
            )}
          </View>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={24}
              color="#5E63E9"
              onPress={() => {
                setScanData("");
                setOpenScanner(true);
              }}
            />
          </View>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  contentContainer: {
    padding: 20,
    margin: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "94%",
  },
  scanData: {
    fontSize: 20,
    marginBottom: 20,
    color: "#5E63E9",
  },
  errorText: {
    fontSize: 20,
    marginBottom: 20,
    color: "red",
  },
  iconContainer: {
    position: "absolute",
    bottom: 40,
    right: 40,
    zIndex: 1,
    backgroundColor: "#E8E8E8",
    borderRadius: 8,
    padding: 10,
  },
});
