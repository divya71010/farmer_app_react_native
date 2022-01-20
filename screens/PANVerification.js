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



const PANVerification = props => {

    const [selectedFrontImage, setSelectedFrontImage] = useState();
    const [selectedBackImage, setSelectedBackImage] = useState()
    const [isloading, setIsLoading] = useState(false)



    const frontImageHandler = img => {
        if (img.cancelled) {
            return;
        }
        if (!img) {
            Alert.alert('Failed to get the image')
            return;
        }

        const fileName = img.uri.split('/').pop();

        const frontImageData = {
            uri: img.uri,
            name: fileName,
            type: img.type
        }

        setSelectedFrontImage(frontImageData)

       
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

        const backImageData = {
            uri: img.uri,
            name: fileName,
            type: img.type
        }

        setSelectedBackImage(backImageData)

    }

    const verifyPANCardHandler = async () => {
        if (!selectedFrontImage) {
            Alert.alert('Select front image')
            return;
        }
        if (!selectedBackImage) {
            Alert.alert('Select back image')
            return;
        }

        setIsLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic QUlMRVBOTDZJMUdEWDFTMlQyNVVRTzg1NFpRNVNFVEE6RkE2SUdHMVhTWUhIVjQ2NjdRU0lMN1NDSEFGSTRaRDU=");

        var formdata = new FormData();
        formdata.append("front_part", selectedFrontImage, selectedFrontImage.uri);
        formdata.append("back_part", selectedBackImage, selectedBackImage.uri);
        formdata.append("should_verify", "true");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://ext.digio.in:444/v3/client/kyc/analyze/file/idcard", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error))


        setIsLoading(false)
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


export default PANVerification