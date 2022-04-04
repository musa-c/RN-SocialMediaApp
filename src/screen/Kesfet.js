import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, Pressable } from 'react-native'
import firebase from 'firebase/compat/app'
import { Avatar, Card, IconButton } from 'react-native-paper'; 
import ContactRow from '../component/ContactRow';

const Kesfet = ({navigation}) => {
    const [users, setUsers] = useState([]);
    useEffect(()=>{
            // SHFT ALT F YAPMADIN

        let unmounted = false;
        firebase.firestore().collection("user").onSnapshot((snapshot)=>{
            const users = [];
            snapshot.forEach((docs) => {
               users.push({
                   ...docs.data(),
                   key: docs.id,
               })
               if(!unmounted){
                   setUsers(users);
               }

            })
        })
        return () => {
            unmounted = true;
          };
    }, [])
    return (
        <View style={{flex:1, backgroundColor:"white"}}>
            <FlatList 
            data={users}
            renderItem={({item}) =>
            (
                <ContactRow
                name={item.name}
                subtitle={item.UserName}
                avatar={item.avatar}
                onPress={()=>navigation.navigate({name: "UsersProfile", params: {id: item.key, UserName:item.UserName}})}
                />
            )}
            
            />
        </View>
    )
}

export default Kesfet
