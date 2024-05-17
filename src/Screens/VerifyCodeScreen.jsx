import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useClerk, useSignUp } from "@clerk/clerk-expo";
import { log } from "../../logger";
import { styles } from "../Theme/Styles";
import { BORDERRADIUS, COLORS, SPACING } from "../Common/constants";

export default function VerifyCodeScreen({ navigation }) {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [code, setCode] = React.useState("");
  const [serverErrors, setServerErrors] = React.useState([]);

  const onPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      await setActive({ session: completeSignUp.createdSessionId });
      setServerErrors([]);
    } catch (err) {
      console.log(err);
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
      if (err?.errors) {
        setServerErrors(err.errors.map((error) => error.longMessage));
      } else {
        setServerErrors(["Registration failed. Please try again."]);
      }
    }
  };

  return (
    <View style={newStyle.container}>
      <View style={newStyle.inputView}>
        <TextInput
          value={code}
          style={styles.textInput}
          placeholder="OTP"
          placeholderTextColor={COLORS.GreyColor}
          onChangeText={(code) => setCode(code)}
        />
      </View>
      <TouchableOpacity style={newStyle.primaryButton} onPress={onPress}>
        <Text style={styles.primaryButtonText}>Verify Email</Text>
      </TouchableOpacity>
      {serverErrors.length > 0 && (
        <View style={styles.errorView}>
          {serverErrors.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              {error}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const newStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: SPACING.space_15,
    alignItems: "center",
    backgroundColor: COLORS.White,
  },
  inputView: {
    width: "80%",
    marginBottom: SPACING.space_20,
  },
  primaryButton: {
    backgroundColor: COLORS.Primary,
    borderRadius: BORDERRADIUS.radius_8,
    paddingVertical: SPACING.space_12,
    paddingHorizontal: SPACING.space_20,
  },
});
