import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/Colors'


const PickOptions = props => {
    return (
        <TouchableOpacity onPress={props.onpress}>
            <View style={styles.container}>
                <Text style={styles.optiontext}>{props.option}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        backgroundColor: Colors.white,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
    },
    optiontext: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 14
    }
})


export default PickOptions;