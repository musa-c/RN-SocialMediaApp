import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button } from 'react-native'
import firebase from 'firebase/compat/app';

const EditProfile = () => {
    const [UserName, setUserName] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();


    useEffect(()=>{
        const user = firebase.auth().currentUser;
        firebase.firestore().collection("user").doc(user.uid).onSnapshot(snapshot => {
            setUserName(snapshot.data().UserName);
            setName(snapshot.data().name);
            setEmail(snapshot.data().email);
        })
    }, [])

    const ChangeProfile = () => {
        const user = firebase.auth().currentUser;
        firebase.firestore().collection("user").doc(user.uid).update({
            name:name,
            email: email,
            UserName: UserName
        })

        user.updateProfile({
            displayName:name,
        })

        user.updateEmail(email);
        user.updatePassword(password)

    }


    return (
        <View style={styles.cont}>
            <View style={styles.userInfoCont}>
            <View style={styles.userInfo}>
            <Text   style={styles.textHeader}>İsim {name}</Text>
            <TextInput 
            onChangeText={text => setName(text)}
            
            style={styles.textProfile} />
            </View>

            <View style={styles.userInfo}>
            <Text  style={styles.textHeader}>Kullanıcı adı {UserName}</Text>
            <TextInput     
            onChangeText={text => setUserName(text)}
            
            style={styles.textProfile} />
            </View>

            <View style={styles.userInfo}>

            <Text  style={styles.textHeader}>Email {email}</Text>
            <TextInput 
            onChangeText={text => setEmail(text)}
            
            style={styles.textProfile} />
            </View>

            <View style={styles.userInfo}>

            <Text  style={styles.textHeader}>Şifre </Text>
            <TextInput 
            secureTextEntry
            onChangeText={text => setPassword(text)}

            style={styles.textProfile} />
            </View>
            </View>

            <Button title= "Değişiklikleri Kaydet" onPress={() => ChangeProfile()}></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    cont:{
        flex:1,
        backgroundColor:"white"
    },
    userInfoCont:{
    },
    userInfo:{
        padding:20,
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderColor:"black"
    },
    textHeader:{
        color:"grey"
    },
    textProfile:{
        color:"black",
        fontSize:20,
        backgroundColor:"grey",
        borderRadius:15,
        padding:10
    }
})

export default EditProfile
