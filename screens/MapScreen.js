import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Colors from '../constants/Colors';


const MapScreen = props => {
    let markerCoordinates;
    let initialLocation;
    let readOnly;
    if (props.route.params) {
        initialLocation = props.route.params.initialLocation;
        readOnly = props.route.params.readOnly;
    }
    const [selectedLocation, setSelectedLocation] = useState(initialLocation)

    const mapRegion = {
        latitude: initialLocation ? initialLocation.lat : 37.78,
        longitude: initialLocation ? initialLocation.lng : -122.43,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    };

    const savePickedLocationHandler = () => {
        if (!selectedLocation) {
            return;
        }
        props.navigation.navigate('NewPlaceScreen', { pickedLocation: selectedLocation });
    };


    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (!readOnly && <TouchableOpacity
                style={styles.headerButton}
                onPress={savePickedLocationHandler}>
                <Text style={styles.headerButtonText}>SAVE</Text>
            </TouchableOpacity>)
        })

    }, [savePickedLocationHandler])


    useEffect(() => {
    }, [selectedLocation])

    const selectLocationHandler = event => {
        setSelectedLocation({
            lat: event.nativeEvent.coordinate.latitude,
            lng: event.nativeEvent.coordinate.longitude
        });
    };


    if (selectedLocation) {
        markerCoordinates = {
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng
        }
    }

    return <MapView style={styles.map} region={mapRegion} onPress={selectLocationHandler}>
        {markerCoordinates && <Marker title='Picked Location' coordinate={markerCoordinates} ></Marker>}
    </MapView>;
};

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    headerButton: {
        marginHorizontal: 20
    },
    headerButtonText: {
        fontSize: 16,
        color: Colors.primary
    }
});

export default MapScreen;
