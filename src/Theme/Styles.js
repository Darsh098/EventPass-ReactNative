import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  oauthView: {
    borderBottomWidth: 2,
    borderBottomColor: "#5E63E9",
    marginBottom: 20,
  },
  inputView: {
    width: "100%",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#5E63E9",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    borderColor: "#5E63E9",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  secondaryButtonText: {
    color: "#5E63E9",
    fontSize: 16,
    fontWeight: "bold",
  },
});
