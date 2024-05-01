import {
  StyleSheet,
    View,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
export default GradientBox = ({
    width,
    height,
    top,
    left,
    opacity,
    angle,
    colors,
    stops,
    startX,
    enxX,
    startY,
    endY
}) => {
    const gradientStyle = {
        width,
        height,
        top,
        left,
        opacity,
        transform: [{ rotate: `${angle}deg` }],
    };

    return (
        <View style={[styles.container, gradientStyle]}>
            <LinearGradient
                colors={colors}
                start={{ x: startX, y: startY }}
                end={{ x: enxX, y: endY }}
                style={[styles.gradient, {}]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
    },
    gradient: {
        flex: 1,
    },
});