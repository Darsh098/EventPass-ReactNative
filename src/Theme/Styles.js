import { StyleSheet } from "react-native";
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from "../Common/constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: SPACING.space_20,
    backgroundColor: COLORS.LightGrey,
  },
  oauthView: {
    borderBottomWidth: SPACING.space_2,
    borderBottomColor: COLORS.Primary,
    marginBottom: SPACING.space_20,
  },
  inputView: {
    width: "100%",
    marginBottom: SPACING.space_20,
  },
  textInput: {
    width: "100%",
    borderWidth: SPACING.space_1,
    borderColor: COLORS.GreyColor,
    borderRadius: BORDERRADIUS.radius_8,
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_15,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: COLORS.Primary,
    borderRadius: BORDERRADIUS.radius_8,
    paddingVertical: SPACING.space_15,
    alignItems: "center",
    marginBottom: SPACING.space_10,
  },
  primaryButtonText: {
    color: COLORS.White,
    fontSize: FONTSIZE.size_16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    borderColor: COLORS.Primary,
    borderWidth: SPACING.space_1,
    borderRadius: BORDERRADIUS.radius_8,
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
    marginLeft: SPACING.space_10,
  },
  secondaryButtonText: {
    color: COLORS.Primary,
    fontSize: FONTSIZE.size_16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    marginTop: SPACING.space_20,
    alignItems: "center",
  },
  errorText: {
    color: COLORS.Red,
    fontSize: FONTSIZE.size_14,
    marginTop: SPACING.space_5,
  },
  errorView: {
    marginTop: SPACING.space_10,
  },
});
