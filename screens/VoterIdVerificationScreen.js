import React, { useState, useCallback } from 'react';
import {
    ScrollView,
    View,
    Button,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';
import * as FileSystem from 'expo-file-system';

import Colors from '../constants/Colors';
import PanCardPicker from '../components/PANCardPicker'
import ENV from '../env'



const VoterIdVerificationScreen = props => {

    const [selectedFrontImage, setSelectedFrontImage] = useState();
    const [selectedBackImage, setSelectedBackImage] = useState()
    const [isloading, setIsLoading] = useState(false)
    const [voterIdResponse, setvoterIdResponse] = useState('')



    const frontImageHandler = async (img) => {
        if (img.cancelled) {
            return;
        }
        if (!img) {
            Alert.alert('Failed to get the image')
            return;
        }

        const fileName = img.uri.split('/').pop();
        setSelectedFrontImage({ uri: img.uri, name: fileName, type: img.type })

    };

    const backImageHandler = img => {

        if (img.cancelled) {
            return;
        }
        if (!img) {
            Alert.alert('Failed to get the image')
            return;
        }

        const fileName = img.uri.split('/').pop();
        setSelectedBackImage({ uri: img.uri, name: fileName, type: img.type })


    }

    const verifyPANCardHandler = async () => {

        if (!selectedFrontImage) {
            Alert.alert('Select front image')
            return;
        }

        /* if (!selectedBackImage) {
            Alert.alert('Select back image')
            return;
        }
 */
        setIsLoading(true)
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Basic QUlMRVBOTDZJMUdEWDFTMlQyNVVRTzg1NFpRNVNFVEE6RkE2SUdHMVhTWUhIVjQ2NjdRU0lMN1NDSEFGSTRaRDU=");
            myHeaders.append("Content-Type", "multipart/form-data");

            var formdata = new FormData();
            formdata.append("front_part", { uri: selectedFrontImage.uri, name: selectedFrontImage.name, type: "image/jpg" }, selectedFrontImage.uri);
           // formdata.append("back_part", { uri: selectedBackImage.uri, name: selectedBackImage.name, type: "image/jpg" }, selectedBackImage.uri);
            formdata.append("should_verify", "true");

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            const response = await fetch("https://ext.digio.in:444/v3/client/kyc/analyze/file/idcard", requestOptions)
            const responseJSON = await response.json()
            setIsLoading(false)
            setvoterIdResponse(JSON.stringify(responseJSON))
           
            console.log('responseJSON ', responseJSON)

        } catch (e) {
            setIsLoading(false)
            console.log('e ', e)
        }

    }




    if (isloading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    return (
        <ScrollView>
            <View style={styles.form}>
                <PanCardPicker
                    frontImageHandler={frontImageHandler}
                    backImageHandler={backImageHandler} />

                <Button
                    title="VERIFY"
                    color={Colors.primary}
                    onPress={verifyPANCardHandler}
                />

                <Text>{voterIdResponse}</Text>
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
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export default VoterIdVerificationScreen