import * as FileSystem from 'expo-file-system';

export const ADD_PLACE = 'ADD_PLACE';
export const SET_PLACES = 'SET_PLACES';
import { insertPlace, fetchPlaces } from '../helpers/db';
import ENV from '../env'

export const addPlace = (title, image, location, langId) => {
    return async dispatch => {
        const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${location.lat}&lon=${location.lng}&lang=${langId}&apiKey=${ENV.mapsApiKey}`)
        const resData = await res.json()
        if (!resData) {
            throw Error('Something went wrong')
        }
        const address = resData.features[0].properties.formatted
        const fileName = image.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName;
        try {
            await FileSystem.moveAsync({
                from: image,
                to: newPath
            });

            const dbResult = await insertPlace(title, newPath, address, location.lat, location.lng)

            dispatch({
                type: ADD_PLACE, placeData: {
                    id: dbResult.insertId,
                    title: title,
                    image: newPath,
                    address: address,
                    coords: {
                        lat: location.lat,
                        lng: location.lng
                    }
                }
            });
        } catch (err) {
            console.log('addPlace ', err);
            throw err;
        }
    };
};


export const loadPlaces = () => {
    return async dispatch => {
        try {
            const dbResult = await fetchPlaces();
            dispatch({ type: SET_PLACES, places: dbResult.rows._array });
        } catch (err) {
            throw err;
        }
    };
};