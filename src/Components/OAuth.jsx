import React, { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useWamUpBrowser } from "../Hooks/useWarmUpBrowser";
import { styles } from "../Theme/Styles";
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from "../Common/constants";

WebBrowser.maybeCompleteAuthSession();

export function OAuthButtons() {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWamUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const [isLoading, setIsLoading] = useState(false);

  const onPress = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <TouchableOpacity
      style={newStyles.secondaryButton}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={COLORS.Primary} />
      ) : (
        <>
          <Image
            source={require("../../assets/googlex36.png")}
            style={newStyles.image}
          />
          <Text style={styles.secondaryButtonText}>Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const newStyles = StyleSheet.create({
  secondaryButton: {
    marginTop: SPACING.space_15,
    borderColor: COLORS.Primary,
    borderWidth: SPACING.space_1,
    borderRadius: BORDERRADIUS.radius_8,
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.space_20,
  },
  image: {
    width: SPACING.space_24,
    height: SPACING.space_24,
    marginRight: SPACING.space_10,
  },
});
