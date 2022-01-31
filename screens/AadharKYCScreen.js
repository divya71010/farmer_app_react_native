import React, { useState, useCallback } from 'react';
import {
    ScrollView,
    View,
    Button,
    Text,
    TextInput,
    StyleSheet,
    ActivityIndicator
} from 'react-native';

import Colors from '../constants/Colors';

const AadharKYCScreen = props => {
    const [mobileNum, setmobileNum] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [kycResponse, setKycResponse] = useState('')

    const getkycDetails = async (k_id) => {
        setIsLoading(true)
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Basic QUkyNThYMk4zNlJEOVNHQUtUWks0TDZUUUxQWlZXUkI6QkNJNjlHSFNISFhKTTM0QUFLTDZZUFFMQVFGQVZTMlU=");
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            var raw = "";
            const response = await fetch(`https://ext.digio.in:444//client/kyc/v2/${k_id}/response`, requestOptions)
            const responseJSON = await response.json()
            setKycResponse(JSON.stringify(responseJSON))
            setIsLoading(false)
        } catch (e) {
            setIsLoading(false)
            console.log('e getkycDetails', e)
        }
    }

    const aadharDigiLockerHandler = async () => {

        setIsLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic QUkyNThYMk4zNlJEOVNHQUtUWks0TDZUUUxQWlZXUkI6QkNJNjlHSFNISFhKTTM0QUFLTDZZUFFMQVFGQVZTMlU=");
        myHeaders.append("Content-Type", "application/json");


        try {
            var raw = JSON.stringify({
                "customer_identifier": mobileNum,
                "actions": [
                    {
                        "type": "DIGILOCKER",
                        "title": "Provide Your Aadhar details",
                        "document_types": ["AADHAAR"],
                        "description": "Description"
                    }
                ],
                "notify_customer": false
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch("https://ext.digio.in:444/client/kyc/v2/request", requestOptions)
            const responseJSON = await response.json();
            let K_Id = responseJSON.id;
            let identifier = "divya.agarwal@adaptwise.in";
            let random_txn_id = "1111"
            let GWT_token_id = responseJSON.access_token.id;

            //old gateway url provided by divya
            //let redirectURL = `https://ext.digio.in//#/gateway/login/${K_Id}/${random_txn_id}/${identifier}?l&token_id=${GWT_token_id};`

            //url by suyash
            let redirectURL = `https://ext.digio.in/#/gateway/login/${K_Id}/${random_txn_id}/${mobileNum}`

            props.navigation.navigate('WebViewScreen', { url: redirectURL })

            setIsLoading(false)


        } catch (e) {
            setIsLoading(false)
            console.log(e)
        }


    }

    const aadharOfflinexmlHandler = async () => {

        setIsLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic QUkyNThYMk4zNlJEOVNHQUtUWks0TDZUUUxQWlZXUkI6QkNJNjlHSFNISFhKTTM0QUFLTDZZUFFMQVFGQVZTMlU=");
        myHeaders.append("Content-Type", "application/json");

        try {
            var raw = JSON.stringify({
                "customer_identifier": mobileNum,
                "actions": [
                    {
                        "type": "AADHAAR_OFFLINE",
                        "title": "Provide Your Aadhar details",
                        "description": "Description"
                    }
                ],
                "notify_customer": false
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch("https://ext.digio.in:444/client/kyc/v2/request", requestOptions)
            const responseJSON = await response.json();
            let K_Id = responseJSON.id;
            let identifier = "divya.agarwal@adaptwise.in";
            let random_txn_id = "1111"
            let GWT_token_id = responseJSON.access_token.id;

            //old gateway url provided by divya
            //let redirectURL = `https://ext.digio.in//#/gateway/login/${K_Id}/${random_txn_id}/${identifier}?l&token_id=${GWT_token_id};`

            //url by suyash
            let redirectURL = `https://ext.digio.in/#/gateway/login/${K_Id}/${random_txn_id}/${mobileNum}`

            props.navigation.navigate('WebViewScreen', { url: redirectURL })

            setIsLoading(false)


        } catch (e) {
            setIsLoading(false)
            console.log(e)
        }
    }

    const setmobNumHandler = text => setmobileNum(text)


    return (
        <ScrollView>
            <View style={styles.form}>
                <TextInput
                    placeholder='Enter mobile number'
                    style={styles.textInput}
                    onChangeText={setmobNumHandler}
                    value={mobileNum}
                />

                {!isLoading ? <View style={{ flexDirection: 'column' }}>
                    <View style={styles.btnContainer}>
                        <Button
                            title="Digilocker"
                            color={Colors.primary}
                            onPress={aadharDigiLockerHandler}
                        />
                    </View>

                    <View style={styles.btnContainer}>
                        <Button
                            title="Offilne XML"
                            color={Colors.primary}
                            onPress={aadharOfflinexmlHandler}
                        />
                    </View>

                    <View style={styles.btnContainer}>
                        <Button
                            title="get kyc details"
                            color={Colors.primary}
                            onPress={getkycDetails.bind(this, "KID220131172831409JZQ74FWRNW2TY7")}
                        />
                    </View>


                </View> : <ActivityIndicator size="large" color={Colors.primary} />}

                <Text>{kycResponse}</Text>
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
    },
    btnContainer: {
        marginVertical: 5
    }
});

export default AadharKYCScreen;