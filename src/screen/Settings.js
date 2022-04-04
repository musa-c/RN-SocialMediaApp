import React from 'react'
import { View, Text } from 'react-native'
import Cell from '../component/Cell'
import firebase from 'firebase/compat/app';



const Settings = ({navigation}) => {
    return (
        <View>
 
               <Cell
            title="Çıkış"
            icon="log-out-outline"
            tintColor="red"
            onPress={()=> firebase.auth().signOut()}
            />
        </View>
    )
}

export default Settings
