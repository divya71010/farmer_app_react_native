import React, { useEffect } from 'react'
import { Text, View, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import PlaceItem from '../components/PlaceItem'
import * as placesAction from '../store/palces-action'

const PlacesListScreen = props => {
    const places = useSelector(state => state.places.places)
   
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(placesAction.loadPlaces())
    }, [dispatch])


    return (
        <FlatList
            data={places} 
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <PlaceItem
                    image={itemData.item.imageUri}
                    title={itemData.item.title}
                    address={itemData.item.address}
                    onSelect={() => {
                        props.navigation.navigate('PlaceDetailsScreen', {
                            placeTitle: itemData.item.title,
                            placeId: itemData.item.id
                        })
                    }} />)
            } />
    )
}

export default PlacesListScreen