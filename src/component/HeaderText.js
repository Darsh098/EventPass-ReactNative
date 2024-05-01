import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FontWeight } from '../common/styles'

const HeaderText = ({ text }) => {
    return (
        <View style={styles.firstLine}>
            <Text style={styles.firstLineText}>{text}</Text>
        </View>
    )
}

export default HeaderText

const styles = StyleSheet.create({
    firstLine: {
        height: 26,
        marginTop: 138,
        marginBottom: 32,
    },
    firstLineText: {
        fontWeight: FontWeight.THIN,
        fontSize: 18,
        lineHeight: 26,
        color: "#FFF",
    },
})