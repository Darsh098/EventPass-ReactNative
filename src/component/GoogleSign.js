import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontWeight } from '../common/styles'

const GoogleSign = () => {
    return (
        <TouchableOpacity style={styles.googleButton}>
            <Image
                source={require("../../assets/image/google.png")}
                style={styles.googleImage}
                resizeMode="contain"
            ></Image>
            <Text style={[styles.buttonText, { color: "#FFF" }]}>
                Continue Woith Google
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
