import React, { useState } from 'react';
import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview';

const WebViewScreen = props => {
    const redirect_url = props.route.params.url;
    console.log('redirect_url ',redirect_url)

    const navigationStateChangeHandler = data => {
       // console.log('data ', data)
    }

    return (
        <WebView
            style={styles.container}
            source={{ uri: redirect_url }}
            onNavigationStateChange={navigationStateChangeHandler}
        />
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})


export default WebViewScreen;