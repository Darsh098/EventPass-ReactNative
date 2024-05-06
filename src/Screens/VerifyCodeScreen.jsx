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

export default function VerifyCodeScreen({ navigation }) {
  const { isLoaded, signUp, setSession } = useSignUp();

  const [code, setCode] = React.useState("");

  const onPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setSession(completeSignUp.createdSessionId);
    } catch (err) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  };

  return (
    <View style={newStyle.container}>
      <View style={newStyle.inputView}>
        <TextInput
          value={code}
          style={styles.textInput}
          placeholder="OTP"
          placeholderTextColor="#A9A9A9"
          onChangeText={(code) => setCode(code)}
        />
      </View>
      <TouchableOpacity style={newStyle.primaryButton} onPress={onPress}>
        <Text style={styles.primaryButtonText}>Verify Email</Text>
      </TouchableOpacity>
    </View>
  );
}

const newStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  inputView: {
    width: "80%",
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#5E63E9",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
});
