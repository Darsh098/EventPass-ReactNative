import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontWeight } from '../common/styles'

const SwitchLine = ({ message, touchbleMessage, onPress }) => {
    return (
        <View
            style={[styles.mesStyle]}
        >
            <Text style={[{ color: "#FFF", opacity: 0.7 }]}>
                {message} &nbsp;
            </Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={{ color: "#D4FB54", opacity: 1 }}>
                    {touchbleMessage}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default SwitchLine

const styles = StyleSheet.create({
    mesStyle: {
        fontSize: 12,
        fontWeight: FontWeight.THIN,
        lineHeight: 18,
        textAlign: "right",
        color: "#D4FB54",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
})