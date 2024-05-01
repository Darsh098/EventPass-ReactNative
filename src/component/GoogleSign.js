import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontWeight } from '../common/styles'
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from '../Hook/useWarmUpBrowser';
import { useNavigation } from "@react-navigation/native";

const GoogleSign = () => {

    const navigation = useNavigation();

    useWarmUpBrowser();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const onPress = React.useCallback(async () => {
        console.log("on press");
        try {
            const { createdSessionId, signIn, signUp, setActive } =
                await startOAuthFlow();

            console.log({ signIn });
            console.log('====================================');
            console.log({ signUp });

            if (createdSessionId) {
                setActive({ session: createdSessionId });
                console.log('====================================');
                console.log("reached");
                console.log('====================================');
                navigation.navigate("TAB");
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, []);

    return (
        <TouchableOpacity style={styles.googleButton} onPress={onPress}>
            <Image
                source={require("../../assets/image/google.png")}
                style={styles.googleImage}
                resizeMode="contain"
            ></Image>
            <Text style={[styles.buttonText, { color: "#FFF" }]}>
                Continue With Google
            </Text>
        </TouchableOpacity>
    )
}

export default GoogleSign

const styles = StyleSheet.create({
    buttonText: {
        fontWeight: FontWeight.MEDIUM,
        fontSize: 14,
        lineHeight: 22,
        color: "black",
        textAlign: "center",
    },
    googleButton: {
        borderColor: "#FFF",
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 18,
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    googleImage: {
        height: 20,
        width: 20,
    },
});
