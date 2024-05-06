import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useWamUpBrowser } from "../Hooks/useWarmUpBrowser";
import { styles } from "../Theme/Styles";
import { COLORS } from "../Theme/theme";

WebBrowser.maybeCompleteAuthSession();

export function OAuthButtons() {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWamUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <TouchableOpacity style={newStyles.secondaryButton} onPress={onPress}>
      <Image
        source={require("../../assets/googlex36.png")}
        style={newStyles.image}
      />
      <Text style={styles.secondaryButtonText}>Continue with Google</Text>
    </TouchableOpacity>
  );
}

const newStyles = StyleSheet.create({
  secondaryButton: {
    marginTop: 15,
    borderColor: COLORS.Primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
});
