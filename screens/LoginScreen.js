import React, { useState, useCallback } from 'react';
import {
    ScrollView,
    View,
    Button,
    Text,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Alert
} from 'react-native';
import Colors from '../constants/Colors';

const LoginScreen = props => {
    const [mobile, setMobile] = useState('')
    const [otp, setOtp] = useState('')
    const [isOtpRecived, setIsOtpRecieved] = useState(false)
    const [isloading, setIsLoading] = useState(false)

    const setMobilenumHandler = value => {
        setMobile(value.replace(/[^0-9]/g, ''))
    }

    const setOtpHandler = value => {
        setOtp(value.replace(/[^0-9]/g, ''))
    }

    const receiveOtp = async () => {
        if (mobile.length < 10) {
            Alert.alert('Enter valid mobile number')
        }
        else {
            setIsLoading(true)
            var formdata = new FormData();
            formdata.append("mobile", mobile);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };
            try {

                const response = await fetch("http://18.218.21.129/sendmsg", requestOptions)
                const resJSON = await response.json()
                console.log('receiveOtp resJSON ',resJSON)
                setIsLoading(false)

                if (resJSON.status === true) {
                    setIsOtpRecieved(true)
                } else {
                    Alert.alert('Something went wrong', resJSON.message)
                    setIsOtpRecieved(false)
                }

            } catch (e) {
                setIsLoading(false)
                setIsOtpRecieved(false)
                console.log('receiveOtp ', e)
                Alert.alert('Something went wrong', e)
            }
        }

    }

    const verifyOtp = async () => {
        setIsLoading(true)
        var formdata = new FormData();
        formdata.append("mobile", mobile);
        formdata.append("otp", otp);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        try {
            const response = await fetch("http://18.218.21.129/verifyotp", requestOptions)
            const resJSON = await response.json()
            console.log('verifyOtp resJSON ',resJSON)

            setIsLoading(false)

            if (resJSON.status === true) {
                props.navigation.navigate('PlacesListScreen')
            } else {
                Alert.alert('Something went wrong', resJSON.message)
                setIsOtpRecieved(false)
            }

        } catch (e) {
            setIsLoading(false)
            console.log('verifyOtp ', e)
            Alert.alert('Something went wrong', e)
        }
    }



    if (isloading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    return (
        <ScrollView>
            <View style={styles.form}>
                <Text style={styles.label}>Mobile number</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={setMobilenumHandler}
                    value={mobile}
                    keyboardType='number-pad'
                    maxLength={10}
                />

                {isOtpRecived ?
                    <View>
                        <Text style={styles.label}>OTP</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setOtpHandler}
                            value={otp}
                            keyboardType='number-pad'
                        />
                    </View> :
                    <View></View>}

                <Button
                    title={isOtpRecived ? "VERIFY OTP " : "GET OTP"}
                    color={Colors.primary}
                    onPress={isOtpRecived ? verifyOtp : receiveOtp}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    form: {
        margin: 30
    },
    label: {
        fontSize: 18,
        marginBottom: 15
    },
    textInput: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 15,
        paddingVertical: 4,
        paddingHorizontal: 2
    }
});

export default LoginScreen;