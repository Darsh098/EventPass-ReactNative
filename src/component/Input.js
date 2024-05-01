import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const Input = ({placeholder=""}) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={"rgba(255, 255, 255, 0.4)"}
        />
    )
}

export default Input

const styles = StyleSheet.create({
    input: {
        height: 48,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#FFF",
        backgroundColor: "transparent",
        borderRadius: 10,
        color: "#FFF",
        gap: 10,
    },
})