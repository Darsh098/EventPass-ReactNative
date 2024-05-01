import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import GradientBox from './GradientBox'


const BoxGradient = () => {
    return (
        <GradientBox
            width={"100%"}
            height={800}
            top={0}
            left={0}
            opacity={10}
            angle={180}
            colors={[
                "rgba(93, 98, 78, 8)",
                "rgba(93, 98, 78, 0.6)",
                "rgba(93, 98, 78, 0.4)",
                "rgba(93, 98, 78,0.2)",
                "rgba(93, 98, 78, 0.1)",
                "rgba(93, 98, 78, 0)",
            ]}
            startX={0}
            enxX={0.3}
            startY={1}
            endY={0.7}
        />
    )
}

export default BoxGradient

const styles = StyleSheet.create({})