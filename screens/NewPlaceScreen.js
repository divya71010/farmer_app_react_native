import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Button,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
import { useDispatch } from 'react-redux';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { en, hi } from '../i18n/supportedLanguages'

import Colors from '../constants/Colors';
import * as placesActions from '../store/palces-action';
import ImagePicker from '../components/ImagePicker';
import LocationPicker from '../components/LocationPicker';




const NewPlaceScreen = props => {
  let lang = props.route.params.lang;
  const [titleValue, setTitleValue] = useState('');
  const [selectedImage, setSelectedImage] = useState();
  const [selectedLocation, setSelectedLocation] = useState()

  i18n.fallbacks = true;
  i18n.translations = { en, hi };
  i18n.locale = lang ? lang : Localization.locale

  const dispatch = useDispatch();


  const titleChangeHandler = text => {
    // you could add validation
    setTitleValue(text);
  };

  const imageTakenHandler = imagePath => {
    console.log('imagePath ',imagePath)
    setSelectedImage(imagePath);
  };

  const savePlaceHandler = () => {
    dispatch(placesActions.addPlace(titleValue, selectedImage, selectedLocation,lang));
    props.navigation.goBack();
  };



  const locationPickedHandler = useCallback(location => {
    setSelectedLocation(location)
    // console.log('location ', location)
  }, [])

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>{i18n.t('title')}</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={titleChangeHandler}
          value={titleValue}
          route={props.route}
        />
        <ImagePicker
          onImageTaken={imageTakenHandler}
          lang={lang} />
        <LocationPicker
          navigation={props.navigation}
          route={props.route}
          onLocationPicked={locationPickedHandler}
          lang={lang} />
        <Button
          title={i18n.t('savePlace')}
          color={Colors.primary}
          onPress={savePlaceHandler}
        />
      </View>
    </ScrollView>
  );
};

/* NewPlaceScreen.navigationOptions = {
  headerTitle: 'Add Place'
};
 */
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

export default NewPlaceScreen;
