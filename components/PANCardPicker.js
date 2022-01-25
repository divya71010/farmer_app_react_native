import React, { useState, useCallback } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BottomSheet } from 'react-native-btr';


import Colors from '../constants/Colors';
import PickOptions from './PickOption';



const PanCardPicker = props => {
    const launchOptions = { mediaTypes: ImagePicker.MediaTypeOptions.All, allowsEditing: true, aspect: [16, 9], quality: 0.5 }

    const [frontImage, setFrontImage] = useState()
    const [backImage, setBackImage] = useState()
    const [showBottomSheet, setShowBottonSheet] = useState(false)
    const [isFront, setIsFront] = useState(true)

    

    const showBottom = (front) => {
        setIsFront(front)
        setShowBottonSheet(true)
    }

    const verifyPermissions = async () => {
        const result = await ImagePicker.requestCameraPermissionsAsync()
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant camera permissions to use this app.',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    };

    const verifyGalleryPermissions = async () => {
        const result = await ImagePicker.requestMediaLibraryPermissionsAsync(true)
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant gallery permissions to use this app.',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    }

    const takeImageHandler = async (front) => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }

        const image = await ImagePicker.launchCameraAsync(launchOptions);
        setShowBottonSheet(false)

        if (front) {
            setFrontImage(image.uri);
            props.frontImageHandler(image)
            return;
        }

        setBackImage(image.uri)
        props.backImageHandler(image)

    };

    const selectImageHandler = async (front) => {

        const hasPermission = await verifyGalleryPermissions();
        if (!hasPermission) {
            return;
        }

        const image = await ImagePicker.launchImageLibraryAsync(launchOptions)
        setShowBottonSheet(false)

        if (front) {

            setFrontImage(image.uri);
            props.frontImageHandler(image)
            return;
        }

        setBackImage(image.uri)
        props.backImageHandler(image)
    }

    let bottomSheetView = <View style={styles.btrContainer}>
        <PickOptions option='Select Image' onpress={selectImageHandler.bind(this, false)} />
        <PickOptions option='Capture Image' onpress={takeImageHandler.bind(this, false)} />
    </View>

    if (isFront) {
        bottomSheetView = <View style={styles.btrContainer}>
            <PickOptions option='Select Image' onpress={selectImageHandler.bind(this, true)} />
            <PickOptions option='Capture Image' onpress={takeImageHandler.bind(this, true)} />
        </View>
    }

    return (
        <View style={styles.imagePicker}>
            <View style={styles.imagePreview}>
                {!frontImage ? (
                    <Text>Front Image</Text>
                ) : (
                    <Image style={styles.image} source={{ uri: frontImage }} />
                )}
            </View>

            <View style={styles.imagePreview}>
                {!backImage ? (
                    <Text>Back Image</Text>
                ) : (
                    <Image style={styles.image} source={{ uri: backImage }} />
                )}
            </View>

            {!props.loading ? < View >
                <View style={styles.btnContainer}>
                    <Button
                        title="FRONT IMAGE"
                        color={Colors.primary}
                        onPress={showBottom.bind(this, true)}
                    />
                </View>


                <View style={styles.btnContainer}>
                    <Button
                        title="BACK IMAGE"
                        color={Colors.primary}
                        onPress={showBottom.bind(this, false)}
                    />
                </View>
            </View> : null

            }
            <BottomSheet visible={showBottomSheet} onBackdropPress={() => { setShowBottonSheet(false) }}>
                {bottomSheetView}
            </BottomSheet>

        </View >
    );
};

const styles = StyleSheet.create({
    imagePicker: {
        alignItems: 'center',
        marginBottom: 15
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1
    },
    image: {
        width: '100%',
        height: '100%'
    },
    btnContainer: {
        marginVertical: 5
    },
    modalContainer: {
        width: '100%',
        borderRadius: 20,
        flexDirection: 'column',
        backgroundColor: Colors.white,
    },
    btrContainer: {
        width: "100%",
        flexDirection: 'column',
        backgroundColor: Colors.whitebg
    }
});

export default PanCardPicker;
