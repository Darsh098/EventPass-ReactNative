import React from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BoxGradient from "../../component/BoxGradient";
import GoogleSign from "../../component/GoogleSign";
import ORDivider from "../../component/ORDivider";
import PrimaryButton from "../../component/PrimaryButton";
import Input from "../../component/Input";
import SwitchLine from "../../component/SwitchLine";
import HeaderText from "../../component/HeaderText";
import { FontWeight } from '../../common/styles';

const LoginScreen = () => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#131415",
                paddingHorizontal: 20,
            }}
        >
            <HeaderText text={"Please sign-in to your account"} />

            <View style={{ borderRadius: 10, overflow: "hidden" }}>
                <Image
                    source={require("../../../assets/image/button-bg.png")}
                    style={styles.imageBackground}
                    resizeMode="cover"
                />

                <BoxGradient />

                <View style={styles.formContainer}>
                    <View style={styles.containerFirstBox}>
                        <View style={styles.textBoxContainer}>
                            <Input placeholder="Email"></Input>
                            <Input placeholder="Password"></Input>
                        </View>

                        <TouchableOpacity style={styles.forgotTextContainer}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.containerSecondBox}>
                        <View style={{ gap: 20 }}>
                            <PrimaryButton text={"Log In"} />

                            <SwitchLine
                                message={"New to our platform?"}
                                touchbleMessage={"Create an account"}
                            />
                        </View>
                        <ORDivider />
                        <GoogleSign />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    imageBackground: {
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: 0.14,
    },
    formContainer: {
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 20,
        color: "#fff",
        gap: 42,
    },
    containerFirstBox: {
        gap: 20,
    },
    containerSecondBox: {
        gap: 24,
    },
    textBoxContainer: {
        gap: 20,
    },

    forgotTextContainer: {
        height: 18,
        justifyContent: "flex-end",
    },
    forgotText: {
        fontSize: 12,
        fontWeight: FontWeight.THIN,
        lineHeight: 18,
        textAlign: "right",
        color: "#D4FB54",
    },
    container: {
        position: "absolute",
    },
});