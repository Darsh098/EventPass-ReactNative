import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import GradientBox from './GradientBox'

const GodRay = () => {
    return (
        <>
            <GradientBox
                width={492.56}
                height={1000}
                top={-100}
                left={-20}
                opacity={0.1}
                angle={56}
                colors={[
                    "rgba(212, 251, 84, 0.36)",
                    "rgba(212, 251, 84, 0.36)",
                    "rgba(212, 251, 84, 0.24)",
                    "rgba(212, 251, 84, 0.12)",
                    "rgba(212, 251, 84, 0.06)",
                    "rgba(212, 251, 84, 0)",
                ]}
                startX={0.1}
                endX={0.5}
                startY={0}
                endY={0}
            />

            <GradientBox
                width={492.56}
                height={1000}
                top={-600}
                left={-10}
                opacity={0.1}
                angle={210}
                colors={[
                    "rgba(212, 251, 84, 0.36)",
                    "rgba(212, 251, 84, 0.36)",
                    "rgba(212, 251, 84, 0.24)",
                    "rgba(212, 251, 84, 0.12)",
                    "rgba(212, 251, 84, 0.06)",
                    "rgba(212, 251, 84, 0)",
                ]}
                startX={0.1}
                endX={0.5}
                startY={0}
                endY={0}
            />
        </>
    )
}

export default GodRay

const styles = StyleSheet.create({})