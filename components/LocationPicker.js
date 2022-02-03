import React, { useEffect, useState } from 'react'
import { View, Button, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native'
import Colors from '../constants/Colors'
import * as Location from 'expo-location'
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { en, hi } from '../i18n/supportedLanguages'

import MapPreview from './MapPreview'

const LocationPicker = props => {
    i18n.fallbacks = true;
    i18n.translations = { en, hi };
    i18n.locale = props.lang ? props.lang : Localization.locale


    const [isFetching, setisFetching] = useState(false)
    const [pickedLocation, setPickedLocation] = useState()
    let mapPickedLocation;

    if (props.route.params) {
        mapPickedLocation = props.route.params.pickedLocation;
    }

    useEffect(() => {
        if (mapPickedLocation) {
            setPickedLocation(mapPickedLocation)
            props.onLocationPicked(mapPickedLocation)
        }
    }, [mapPickedLocation])

    const verifyPermissions = async () => {
        const result = await Location.requestForegroundPermissionsAsync()
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant location permissions to use this app.',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    }


    const getLocationHandler = async () => {
        setisFetching(true)
        const hasPermissions = verifyPermissions()
        if (!hasPermissions) {
            return;
        }
        try {
            const location = await Location.getCurrentPositionAsync({})
            setisFetching(false)
            setPickedLocation({ lat: location.coords.latitude, lng: location.coords.longitude })
            props.onLocationPicked({ lat: location.coords.latitude, lng: location.coords.longitude })
        } catch (e) {
            console.log(e)
            setisFetching(false)
            Alert.alert('Couldnt fetch location', 'Try again later', [{ text: 'Okay' }])
        }
    }

    const pickOnMapHandler = () => {
        props.navigation.navigate('Map');
    };

    return (
        <View style={styles.locationPicker}>
            <MapPreview style={styles.mapPreview} location={pickedLocation}>
                {isFetching ? (
                    <ActivityIndicator size="large" color={Colors.primary} />
                ) : (
                    <Text>{i18n.t('nolocation')}</Text>
                )}
            </MapPreview>

            <View style={styles.actions}>
                <Button
                    title={i18n.t('getLocation')}
                    color={Colors.primary}
                    onPress={getLocationHandler}
                />

                {props.showMapBtn ? <Button
                    title={i18n.t('pickonMap')}
                    color={Colors.primary}
                    onPress={pickOnMapHandler}
                /> : null}
            </View>


        </View>

    )
}


const styles = StyleSheet.create({
    locationPicker: {
        marginBottom: 15
    },
    mapPreview: {
        marginBottom: 10,
        width: '100%',
        height: 150,
        borderColor: '#ccc',
        borderWidth: 1

    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    }
})

export default LocationPicker;