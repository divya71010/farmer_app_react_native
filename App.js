import React, { useState } from 'react';
import { View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';

import { en, hi } from './i18n/supportedLanguages';


const Stack = createNativeStackNavigator()

import NewPlaceScreen from './screens/NewPlaceScreen';
import PlacesListScreen from './screens/PlacesListScreen';
import PlaceDetailsScreen from './screens/PlaceDetailsScreen';
import MapScreen from './screens/MapScreen';

import palcesReducer from './store/palces-reducer';

import { init } from './helpers/db';
import Colors from './constants/Colors';

init()
  .then(() => {
    console.log('Initialized database');
  })
  .catch(err => {
    console.log('Initializing db failed.');
    console.log(err);
  });



const rootReducer = combineReducers({
  places: palcesReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

const App = () => {

  const [selectedLanguage, setselectedLanguage] = useState('en')

  i18n.fallbacks = true;
  i18n.translations = { en, hi };
  i18n.locale = selectedLanguage ? selectedLanguage : Localization.locale

  /*  const setAppSelectedLang = async (langId) => {
     try {
       setselectedLanguage(langId)
       await AsyncStorage.setItem('selectedLanguage', JSON.stringify({ lang: langId }))
     } catch (e) {
       console.log('setAppSelectedLang e', e)
     }
 
   } */

  const HeaderRight = props => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Picker
          {...props}
          style={{ width: 100, height: 40 }}
          selectedValue={selectedLanguage}
          onValueChange={(itemValue, itemIndex) => setselectedLanguage(itemValue)}>
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Hindi" value="hi" />
        </Picker>


        <AntDesign
          name="plus"
          size={24}
          color="black"
          onPress={() => { props.navigation.navigate('NewPlaceScreen') }} />



      </View>


    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="PlacesListScreen" component={PlacesListScreen}
            options={({ navigation }) => ({
              title: i18n.t('listOfPlaces'),
              headerRight: props => <HeaderRight {...props} navigation={navigation} />
            })} />
          <Stack.Screen name="NewPlaceScreen" component={NewPlaceScreen} options={{ title: i18n.t('addPlace') }} initialParams={{ lang: selectedLanguage }} />
          <Stack.Screen name="PlaceDetailsScreen" component={PlaceDetailsScreen} options={{ title: 'Add a place' }} />
          <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Map' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider >
  );
};


export default App;
