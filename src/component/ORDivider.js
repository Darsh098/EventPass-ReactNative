import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FontWeight } from '../common/styles'

const ORDivider = () => {
    return (
        <Text style={[styles.divider]}>
            or
        </Text>
    )
}

export default ORDivider

const styles = StyleSheet.create({
    divider: {
        fontWeight: FontWeight.MEDIUM,
        fontSize: 14,
        lineHeight: 22,
        color: "black",
        textAlign: "center",
        color: "#FFF",
        opacity: 0.6
    },
})