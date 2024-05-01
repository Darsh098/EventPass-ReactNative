import { Platform, StyleSheet } from "react-native";

export const FontWeight = {
  XXT: "100",
  XT: "300",
  THIN: "400",
  MEDIUM: "500",
  BOLD: "600",
  XB: "700",
  XXB: "900",
};

export class StyleUtility {
  static border(color = "red", size = 1, radius = 1) {
    return {
      borderWidth: size,
      borderColor: color,
      borderStyle: "solid",
      borderRadius: radius,
    };
  }
  static spacing(multiplier = 1) {
    return multiplier * 8;
  }
  
  static rgba(hexaColor="#00000", opacity = 1) {
    hexaColor = hexaColor.replace("#", "");
    const hexValues = hexaColor
      .match(/.{1,2}/g)
      .map((val) => parseInt(val, 16));
    const rgbaValues = [...hexValues, opacity];
    return `rgba(${rgbaValues.join(", ")})`;
  };

  static sizing(multiplier = 1) {
    return multiplier * 8;
  }
  static fontWeight(weight = 1) {
    return (weight * 100).toString();
  }
  static font({ size = 1, weight = FontWeight.THIN, color = "#607D8B" }) {
    return {
      fontSize: StyleUtility.sizing(size),
      fontWeight: weight,
      lineHeight: StyleUtility.sizing(size * 1.3),
      color,
    };
  }
  static shadow({
    // elevation = 3,
    // height = 1,
    // width = 0,
    // opacity = 0.1,
    // radius = 3,
  }) {
    return {
      shadowColor: "#cac9c9",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity:  0.17,
      shadowRadius: 2.54,
      elevation: 3
    }
    // return {
    //   shadowColor: "#000000",
    //   shadowOffset: {
    //     width,
    //     height,
    //   },
    //   shadowOpacity: opacity,
    //   shadowRadius: radius,
    //   elevation: elevation ?? Platform.OS === 'android' ? 1 : 1,
    // };
  }
}
  
export default StyleUtility;
