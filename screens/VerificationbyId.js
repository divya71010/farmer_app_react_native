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
import { Picker } from '@react-native-picker/picker';

import Colors from '../constants/Colors';


const VerificationbyId = props => {
    let placeHolderString = "Pan card number"
    const [docId, setDocId] = useState('')
    const [selectedDocument, setSelectedDocument] = useState('PAN')
    const [isloading, setIsLoading] = useState(false)
    const [response, setResponse] = useState('')


    const setDocIdHandler = text => setDocId(text)

    if (selectedDocument === "VOTER_ID") {
        placeHolderString = "Voter Id"
    } else {
        placeHolderString = "Pan card number"
    }


    const verifyDocbyId = async () => {
        if (!docId) {
            Alert('Alert ', 'Enter valid ID ')
        } else if (!selectedDocument) {
            Alert('Alert ', 'Select a document type ')
        } else {
            setIsLoading(true)
            try {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Basic QUkyNThYMk4zNlJEOVNHQUtUWks0TDZUUUxQWlZXUkI6QkNJNjlHSFNISFhKTTM0QUFLTDZZUFFMQVFGQVZTMlU=");
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({ "id_no": docId });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                const response = await fetch(`https://ext.digio.in:444/v3/client/kyc/fetch_id_data/${selectedDocument}`, requestOptions)
                const responseJSON = await response.json()
                setIsLoading(false)
                setResponse(JSON.stringify(responseJSON))
            } catch (e) {
                setIsLoading(false)
                console.log('error ', e)
            }
        }

    }

    const pickerValueHandler = (itemValue, itemIndex) => {
        setDocId('')
        setSelectedDocument(itemValue)
    }

    return (
        <ScrollView>
            <View style={styles.form}>
                <Picker
                    selectedValue={selectedDocument}
                    onValueChange={pickerValueHandler}>
                    <Picker.Item label="PAN card" value="PAN" />
                    <Picker.Item label="Voter id" value="VOTER_ID" />
                </Picker>
                <TextInput
                    placeholder={`Enter ${placeHolderString}`}
                    style={styles.textInput}
                    autoCapitalize='characters'
                    onChangeText={setDocIdHandler}
                    value={docId} />
                {!isloading ? <Button
                    title="VERIFY"
                    color={Colors.primary}
                    onPress={verifyDocbyId} /> : <ActivityIndicator size="large" color={Colors.primary} />}


                <Text>{response}</Text>
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
        marginVertical: 15,
        paddingVertical: 4,
        paddingHorizontal: 2
    }
});

export default VerificationbyId;