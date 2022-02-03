import React, { useState, useCallback } from 'react';
import {
    ScrollView,
    View,
    Button,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    TextInput
} from 'react-native';

import LocationPicker from '../components/LocationPicker';
import Colors from '../constants/Colors';
import ENV from '../env'

const WeatherForeCastScreen = props => {

    const [selectedLocation, setSelectedLocation] = useState()
    const [myAddress, setMyAddress] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showAddress, setShowAddress] = useState(false)
    const [datareceived, setDataReceived] = useState(false)
    const [temperature, setTemperature] = useState('0')
    const [foreCastData, setForeCastData] = useState('')
    const [pincode, setPincode] = useState('')

    const locationPickedHandler = useCallback(async (location) => {
        setSelectedLocation(location)

        const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${location.lat}&lon=${location.lng}&apiKey=${ENV.mapsApiKey}`)
        const resData = await res.json()
        if (!resData) {
            throw Error('Something went wrong')
        }
        const address = resData.features[0].properties.formatted
        setMyAddress(JSON.stringify(address))
        setShowAddress(true)
    }, [])

    const setPincodeHandler = text => setPincode(text.replace(/[^0-9]/g, ''))

    const getWeatherForecast = async (isPincode) => {
        setIsLoading(true)
        let url = `https://api.openweathermap.org/data/2.5/weather?zip=${pincode},in&APPID=6ddaaa3756fd24f939b20df521d886af&units=metric`;
        if (!isPincode) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${selectedLocation.lat}&lon=${selectedLocation.lng}&APPID=6ddaaa3756fd24f939b20df521d886af&units=metric`
        }
        try {
            var requestOptions = { method: 'GET', redirect: 'follow' };
            const response = await fetch(url, requestOptions)
            const responseJson = await response.json()
            console.log('responseJson ',responseJson)
            let temp = responseJson.main.temp + "°C"
            let foreCast = responseJson.weather[0]
            setTemperature(temp)
            setForeCastData(foreCast)
            setIsLoading(false)
            setDataReceived(true)
        } catch (e) {
            setIsLoading(false)
            console.log('eee ', e)
            setDataReceived(false)
        }
    }


    return (
        <ScrollView>
            <View style={styles.form}>
                <LocationPicker
                    navigation={props.navigation}
                    route={props.route}
                    onLocationPicked={locationPickedHandler}
                />

                <Text style={styles.orTextStyle}>OR</Text>


                <TextInput
                    placeholder='Enter Pincode'
                    style={styles.textInput}
                    onChangeText={setPincodeHandler}
                    value={pincode}
                    maxLength={6}
                />
                <Button
                    title="Get weather forecast"
                    color={Colors.primary}
                    onPress={getWeatherForecast.bind(this, true)}
                />


                {showAddress ? <View style={{ marginTop: 15 }}>
                    <Text style={styles.addressHeader}>Your address is :</Text>
                    <Text>{myAddress}</Text>
                    <View style={styles.btnContainer}>
                        {!isLoading ?
                            <Button
                                title="Get weather forecast"
                                color={Colors.primary}
                                onPress={getWeatherForecast.bind(this, false)}
                            /> : <ActivityIndicator color={Colors.primary} size='large' />
                        }
                    </View>
                </View> : null}

                {datareceived ?
                    <View>
                        <Text style={styles.tempHeader}>Temperature at your loaction is</Text>
                        <Text style={styles.tempTextStyles}>{temperature}</Text>

                        <Text style={styles.tempHeader}>Weather forecast for today is</Text>
                        <View style={styles.forecastdataContainer}>
                            <Text style={styles.tempTextStyles}>{foreCastData.description}</Text>
                            <Image source={{ uri: 'https://openweathermap.org/img/w/' + foreCastData.icon + '.png' }} style={{ width: 50, height: 50, marginTop: 25 }} />
                        </View>

                    </View> : null
                }
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    form: {
        margin: 30
    },
    addressHeader: {
        color: Colors.black,
        fontWeight: 'bold',
        fontSize: 16
    },
    btnContainer: {
        marginVertical: 15
    },
    tempTextStyles: {
        height: 100,
        marginTop: 25,
        textAlign: 'center',
        fontSize: 40
    },
    tempHeader: {
        color: Colors.black,
        fontWeight: 'bold',
        fontSize: 20
    },
    forecastdataContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 200,
        justifyContent: 'center'
    },
    orTextStyle: {
        width: '100%',
        height: 50,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: Colors.black,
        fontWeight: 'bold',
        fontSize: 20
    },
    textInput: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 15,
        paddingVertical: 4,
        paddingHorizontal: 2
    }

})

export default WeatherForeCastScreen;