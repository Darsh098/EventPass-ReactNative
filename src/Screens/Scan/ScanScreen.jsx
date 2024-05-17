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
import BarcodeMask from "react-native-barcode-mask";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GET_EVENT_VISITOR_BY_ID } from "../../GraphQL/Queries";
import { UPDATE_EVENT_VISITOR } from "../../GraphQL/Mutations";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  BORDERRADIUS,
  COLORS,
  FONTSIZE,
  SPACING,
} from "../../Common/constants";

export default ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanData, setScanData] = useState("");
  const [openScanner, setOpenScanner] = useState(false);
  const [scanMaximised, setScanMaximised] = useState(false);
  const [getEventVisitor, { loading, data, error }] = useLazyQuery(
    GET_EVENT_VISITOR_BY_ID
  );
  const [updateEventVisitor] = useMutation(UPDATE_EVENT_VISITOR);

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

  const handleBarCodeScanned = async ({ type, data: scannedData }) => {
    // setScanData(data);
    // setOpenScanner(false);
    // getEventVisitor({ variables: { id: parseInt(data) } });
    setScanData(scannedData);
    setOpenScanner(false);
    const { data: eventData } = await getEventVisitor({
      variables: { id: parseInt(scannedData) },
    });
    if (
      eventData &&
      eventData.getEventVisitorById &&
      eventData.getEventVisitorById.events
    ) {
      const { scanned } = eventData.getEventVisitorById;
      const { id, entriesCount } = eventData.getEventVisitorById.events;
      if (entriesCount > scanned) {
        const updatedEntriesCount = scanned + 1;
        await updateEventVisitor({
          variables: {
            id: parseInt(scannedData.toString()),
            scanned: updatedEntriesCount,
          },
        });
      } else {
        setScanData("Exceeded maximum number of scans allowed.");
        setScanMaximised(true);
      }
    }
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
              edgeColor={COLORS.Primary}
              animatedLineColor={COLORS.Primary}
              edgeRadius={BORDERRADIUS.radius_14}
              edgeBorderWidth={SPACING.space_8}
              width={250}
              height={250}
              lineAnimationDuration={1000}
              showAnimatedLine
            />
            <View style={styles.iconContainer}>
              <AntDesign
                name="close"
                size={FONTSIZE.size_24}
                color={COLORS.Primary}
                onPress={() => setOpenScanner(false)}
              />
            </View>
          </BarCodeScanner>
        </>
      ) : (
        <>
          <View style={styles.contentContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.Primary} />
            ) : scanMaximised ? (
              <Text style={styles.errorText}>{scanData}</Text>
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
                  <Text style={styles.errorText}>
                    {error.graphQLErrors[0]?.message || "Invalid QR"}
                  </Text>
                ) : (
                  <Text style={styles.title}>Scan The QR</Text>
                )}
              </>
            )}
          </View>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={FONTSIZE.size_24}
              color={COLORS.Primary}
              onPress={() => {
                setScanData("");
                setScanMaximised(false);
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
    backgroundColor: COLORS.LightGrey,
  },
  title: {
    fontSize: FONTSIZE.size_24,
    fontWeight: "bold",
    color: COLORS.Primary,
  },
  contentContainer: {
    padding: SPACING.space_20,
    margin: SPACING.space_10,
    backgroundColor: COLORS.White,
    borderRadius: BORDERRADIUS.radius_10,
    borderWidth: SPACING.space_1,
    borderColor: COLORS.LightGrey2,
    width: "94%",
  },
  scanData: {
    fontSize: FONTSIZE.size_20,
    marginBottom: SPACING.space_20,
    color: COLORS.Primary,
  },
  errorText: {
    fontSize: FONTSIZE.size_20,
    marginBottom: SPACING.space_20,
    color: COLORS.Red,
  },
  iconContainer: {
    position: "absolute",
    bottom: SPACING.space_40,
    right: SPACING.space_40,
    zIndex: 1,
    backgroundColor: COLORS.IconBackground,
    borderRadius: BORDERRADIUS.radius_8,
    padding: SPACING.space_10,
  },
});
