import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import ContactRow from '../component/ContactRow'
import firebase from 'firebase/compat/app'

const Followed = ({navigation}) => {


    const [users, setUsers] = useState([]);;

    useEffect(()=>{
        let unmounted = false;
        const Follow = [];
        const user = firebase.auth().currentUser;
        firebase.firestore().collection("user").doc(user.uid).collection("follow").onSnapshot((snapshot)=>{
            snapshot.forEach((doc)=>{
                Follow.push({
                    ...doc.data(),
                    key: doc.id
                })
            })

        if (!unmounted) {
            setUsers(Follow)
        }
            
        })

        return () => {
            unmounted = true;
          };
    }, [])

    const ListEmptyComponent = () => {
        return(
            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                <Text style={{fontSize:17}}>Kimseyi takip etmiyosunuz!</Text>
            </View>
        )
    }

    return (
        <View style={{flex:1, backgroundColor:"#fff"}}>
        <View style={{alignItems:"center", padding:10, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:"grey"}}>
        <Text style={{fontSize:20, fontWeight:"bold"}}>TAKİP ETTİKLERİM</Text>
        </View>
            <FlatList 
            data = {users}
            ListEmptyComponent={ListEmptyComponent}
            renderItem={({item})=> (
                <>
                <ContactRow 
                name={item.name}
                subtitle={item.UserName}
                avatar={item.avatar}
                onPress={()=>navigation.navigate({name: "UsersProfile", params: {id: item.id, UserName:item.UserName}})}
                />
                <View style={{borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:"grey"}}></View>
                </>
            )}
            />
          
        </View>
    )
}

export default Followed
