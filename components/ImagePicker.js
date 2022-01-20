import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Helpers from '../helpers/helpers';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { en, hi } from '../i18n/supportedLanguages'


import Colors from '../constants/Colors';

const ImgPicker = props => {
  i18n.fallbacks = true;
  i18n.translations = { en, hi };
  i18n.locale = props.lang ? props.lang : Localization.locale
  const launchOptions = { allowsEditing: true, aspect: [16, 9], quality: 0.5 }

  const [pickedImage, setPickedImage] = useState();

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



  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync(launchOptions);
    setPickedImage(image.uri);
    props.onImageTaken(image.uri);
  };

 



  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>{i18n.t('noImage')}</Text>
        ) : (
          <Image style={styles.image} source={{ uri: pickedImage }} />
        )}
      </View>

      <View style={styles.btnContainer}>
        <Button
          title={i18n.t('takeImage')}
          color={Colors.primary}
          onPress={takeImageHandler}
        />
      </View>



    </View>
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
  }
});

export default ImgPicker;
