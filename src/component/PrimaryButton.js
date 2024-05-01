import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontWeight } from '../common/styles'

const PrimaryButton = ({ text }) => {
    return (
        <TouchableOpacity
            style={{
                backgroundColor: "#D4FB54",
                borderRadius: 4,
                paddingHorizontal: 18,
                paddingVertical: 8,
                gap: 8,
            }}
        >
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    )
}

export default PrimaryButton

const styles = StyleSheet.create({
    buttonText: {
        fontWeight: FontWeight.MEDIUM,
        fontSize: 14,
        lineHeight: 22,
        color: "black",
        textAlign: "center",
    },
})