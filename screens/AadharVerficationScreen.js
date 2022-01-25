import React, { useState, useCallback } from 'react';
import {
    ScrollView,
    View,
    Button,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image
} from 'react-native';
import * as FileSystem from 'expo-file-system';

import Colors from '../constants/Colors';
import PanCardPicker from '../components/PANCardPicker'
import ENV from '../env'



const AadharVerification = props => {

    const [selectedFrontImage, setSelectedFrontImage] = useState();
    const [selectedBackImage, setSelectedBackImage] = useState()
    const [isloading, setIsLoading] = useState(false)
    const [base64Icon, setbase64Icon] = useState()


    const frontImageHandler = (img) => {
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

    const verifyAadharCardHandler = async () => {

        if (!selectedFrontImage) {
            Alert.alert('Select front image')
            return;
        }


        setIsLoading(true)
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Basic QUlMRVBOTDZJMUdEWDFTMlQyNVVRTzg1NFpRNVNFVEE6RkE2SUdHMVhTWUhIVjQ2NjdRU0lMN1NDSEFGSTRaRDU=");
            myHeaders.append("Content-Type", "multipart/form-data");

            var formdata = new FormData();
            formdata.append("file", { uri: selectedFrontImage.uri, name: selectedFrontImage.name, type: "image/jpg" }, selectedFrontImage.uri);
            formdata.append("consent", "yes");

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            const response = await fetch("https://ext.digio.in:444/v3/client/kyc/aadhaar/file/mask?resp_json=true", requestOptions)
            const responseJSON = await response.json()
            setbase64Icon('data:image/jpg;base64,' + responseJSON.data)
            setIsLoading(false)
            console.log('responseJSON ', responseJSON)
            // setaadhaarResponse(JSON.stringify(responseJSON))

        } catch (e) {
            setIsLoading(false)
            console.log('e ', e)
        }

    }




    /*   if (isloading) {
          return (
              <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
              </View>
          )
      } */

    return (
        <ScrollView>
            <View style={styles.form}>
                <PanCardPicker
                    frontImageHandler={frontImageHandler}
                    backImageHandler={backImageHandler}
                    loading={isloading} />
                {!isloading ? <View>
                    <Image style={styles.maskedImageContainer} source={base64Icon ? { uri: base64Icon } : require('../assets/dummyimage.png')} />
                    <Button
                        title="VERIFY"
                        color={Colors.primary}
                        onPress={verifyAadharCardHandler}
                    />
                </View> : <ActivityIndicator size="large" color={Colors.primary} />}
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
    },
    maskedImageContainer: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1
    }
});


export default AadharVerification;