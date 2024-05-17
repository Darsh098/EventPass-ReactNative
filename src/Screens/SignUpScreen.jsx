import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { log } from "../../logger";
import { OAuthButtons } from "../Components/OAuth";
import { styles } from "../Theme/Styles";
import { COLORS, RouteNames } from "../Common/constants";

export default function SignUpScreen({ navigation }) {
  const { isLoaded, signUp } = useSignUp();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [errors, setErrors] = React.useState({});
  const [serverErrors, setServerErrors] = React.useState([]);

  const validate = () => {
    const newErrors = {};

    const alphabetRegex = /^[A-Za-z]+$/;

    if (!firstName) {
      newErrors.firstName = "First name is required.";
    } else if (!alphabetRegex.test(firstName)) {
      newErrors.firstName = "First name can only contain alphabets.";
    } else if (firstName.length > 30) {
      newErrors.firstName = "First name must be less than 30 characters.";
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required.";
    } else if (!alphabetRegex.test(lastName)) {
      newErrors.lastName = "Last name can only contain alphabets.";
    } else if (lastName.length > 30) {
      newErrors.lastName = "Last name must be less than 30 characters.";
    }

    if (!emailAddress) {
      newErrors.emailAddress = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
      newErrors.emailAddress = "Email address is invalid.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      // https://docs.clerk.dev/popular-guides/passwordless-authentication
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setServerErrors([]);
      navigation.navigate(RouteNames.VERIFY_CODE_SCREEN);
    } catch (err) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
      if (err?.errors) {
        setServerErrors(err.errors.map((error) => error.message));
      } else {
        setServerErrors(["An unknown error occurred."]);
      }
    }
  };

  const onSignInPress = () => navigation.replace("SignIn");

  return (
    <View style={styles.container}>
      <View style={styles.oauthView}>
        <OAuthButtons />
      </View>

      <View style={styles.inputView}>
        <TextInput
          value={firstName}
          style={styles.textInput}
          placeholder="First name"
          placeholderTextColor={COLORS.GreyColor}
          onChangeText={(firstName) => setFirstName(firstName)}
        />
        {errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName}</Text>
        )}
      </View>

      <View style={styles.inputView}>
        <TextInput
          value={lastName}
          style={styles.textInput}
          placeholder="Last name"
          placeholderTextColor={COLORS.GreyColor}
          onChangeText={(lastName) => setLastName(lastName)}
        />
        {errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName}</Text>
        )}
      </View>

      <View style={styles.inputView}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor={COLORS.GreyColor}
          onChangeText={(email) => setEmailAddress(email)}
        />
        {errors.emailAddress && (
          <Text style={styles.errorText}>{errors.emailAddress}</Text>
        )}
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
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onSignUpPress}>
        <Text style={styles.primaryButtonText}>Sign up</Text>
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
        <Text>Have an account?</Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSignInPress}
        >
          <Text style={styles.secondaryButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
