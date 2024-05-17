import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { log } from "../../logger";
import { OAuthButtons } from "../Components/OAuth";
import { styles } from "../Theme/Styles";
import { COLORS } from "../Common/constants";

export default function SignInScreen({ navigation }) {
  const { signIn, setSession, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [serverErrors, setServerErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setSession(completeSignIn.createdSessionId);
      setServerErrors([]);
    } catch (err) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
      if (err?.errors) {
        setServerErrors(
          err.errors.map((error) =>
            error.code === "strategy_for_user_invalid"
              ? "Invalid verification strategy. Sign in with Google"
              : error.message
          )
        );
      } else {
        setServerErrors(["Sign-in failed. Please try again."]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUpPress = () => navigation.replace("SignUp");

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.Primary} />
      ) : (
        <>
          <View style={styles.oauthView}>
            <OAuthButtons />
          </View>

          <View style={styles.inputView}>
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              style={styles.textInput}
              placeholder="Email"
              placeholderTextColor={COLORS.GreyColor}
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              value={password}
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor={COLORS.GreyColor}
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onSignInPress}
          >
            <Text style={styles.primaryButtonText}>Sign in</Text>
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

          <View style={styles.footer}>
            <Text>Don't have an account?</Text>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onSignUpPress}
            >
              <Text style={styles.secondaryButtonText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
