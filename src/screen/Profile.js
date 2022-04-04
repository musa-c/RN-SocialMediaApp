import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, FlatList, Image } from 'react-native'
// import { Avatar } from 'react-native-paper';
import IconFeather from 'react-native-vector-icons/Feather';
import firebase from 'firebase/compat/app';
import Modal from "react-native-modal";
import {Ionicons} from "@expo/vector-icons";
import { Avatar } from 'react-native-elements';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';


const Profile = ({navigation}) => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [UserName, setUserName] = useState();
    const [avatar, setAvatar] = useState("");
    const [images, setImages] = useState([]);
    const [GonderiCount, setGonderiCount] = useState(0);
    const [followCount, setFollowCount] = useState(0);
    const [myFollowers, setMyFollowers] = useState(0);


    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };



    useEffect(() => {
        let unmounted = false;
       const user = firebase.auth().currentUser;
       if (!unmounted) {
            setName(user.displayName);
       }
        firebase.firestore().collection("user").doc(user.uid).onSnapshot(snapshot => {
            if (!unmounted) {
            setUserName(snapshot.data().UserName);
            setAvatar(snapshot.data().avatar);
        }
        })
        firebase.firestore().collection("user").doc(user.uid).collection("images").onSnapshot((querySnapshot) => {
            const images = [];
            var gonderiCount = 0;
            querySnapshot.forEach(documentSnapshot => {
                images.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                })
                gonderiCount += 1;
                if(!unmounted){
                    setImages(images);
                    setGonderiCount(gonderiCount);
                }
            })
          
        })

        firebase.firestore().collection("user").doc(user.uid).collection("follow").onSnapshot((querySnapshot)=>{
            // console.log("doküman sayısı: ", querySnapshot.docs.length)
            if(!unmounted){
                setFollowCount(querySnapshot.docs.length)
            }
    
            // console.log("dokümanlar: ", querySnapshot.docs) // dokümanları dizi olarak döndürür.
          })
    
          firebase.firestore().collection("user").doc(user.uid).collection("MyFollowers").onSnapshot((querySnapshot)=>{
            if(!unmounted){
            setMyFollowers(querySnapshot.docs.length)
            }
          })
    
    

        return () => {
            unmounted = true;
          };
    }, [])

    const [avatarFirebase, setAvatarFirebase] = useState("");

    const showImagePicker = async () => {

     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Bu uygulamanın fotoğraflarınıza erişmesine izin vermeyi reddettiniz!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({allowsEditing: true, presentationStyle: 0,});

    if (!result.cancelled) {
        const filename = result.uri.split("/").pop();
        console.log(filename);
        uploadAvatar(result.uri, filename);
      }

    }

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    

        if (permissionResult.granted === false) {
          alert("Bu uygulamanın kameranıza erişmesine izin vermeyi reddettiniz!"); 
            return permissionResult;
        }
    
        const result = await ImagePicker.launchCameraAsync({allowsEditing: true, presentationStyle: 0,});

        if (!result.cancelled) {
            const filename = result.uri.split("/").pop();
            console.log(filename);
            uploadAvatar(result.uri, filename);
          }
    }


    const uploadAvatar = async (uri, imageName)  => {
        const response = await fetch(uri);
        const blob = await response.blob();
    
        var ref = await firebase.storage().ref("avatars/").child(imageName);
        return ref.put(blob).then(()=>{
            firebase.storage().ref("avatars/").child(imageName).getDownloadURL().then((url)=> {
                var user = firebase.auth().currentUser;
                user.updateProfile({photoURL:url});
                firebase.firestore().collection("user").doc(user.uid).set({
                    avatar: url
                }, {merge:true}).then(()=>{
                    firebase.firestore().collection("user").doc(user.uid).onSnapshot(snapshot=>{
                        setAvatar(snapshot.data()?.avatar ?? "");
                    })
                    
                })
            })
        });
      } 
 
    return (
        <View style={styles.cont}>
            <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:10}}>
            <TouchableOpacity onPress={()=> navigation.navigate("Settings")}>
                <IconFeather name="more-horizontal" size={25} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate("Chats")}>
                <IconFeather name="send" size={25} style={{}}/>
            </TouchableOpacity>
            </View>
            <View style={styles.userImage}>
            {
                
                avatar == "https://firebasestorage.googleapis.com/v0/b/isociety-1d816.appspot.com/o/avatars%2FdefaultAvatar.png?alt=media&token=70cc3732-7fcb-4f49-bf1f-548032358f6e" ?

                <Avatar

                size={100}
                rounded
                source={{uri: "https://firebasestorage.googleapis.com/v0/b/isociety-1d816.appspot.com/o/avatars%2FdefaultAvatar.png?alt=media&token=70cc3732-7fcb-4f49-bf1f-548032358f6e"}}
                onPress={toggleModal}
                > 
                
                </Avatar> 

                :

                <Avatar

                size={120}
                rounded
                onPress={toggleModal}
                source={{ uri: avatar !=="" ? avatar : undefined }}
                > 
                
               
                </Avatar> 
                

            }
           
             {/* --- Modal --- */}
             <Modal isVisible={isModalVisible}
      style={{margin:0, justifyContent:"flex-end"}}
      swipeDirection="down"
    onBackdropPress = { ( )  =>  setModalVisible ( false ) } 
      onSwipeComplete = { ( )  =>  setModalVisible ( false ) }
      >
        <View style={{height: Dimensions.get('screen').height / 3.5, backgroundColor:"#fff", borderTopLeftRadius:20, borderTopRightRadius:20}}>
        
            <View style={{width:70, height:6, backgroundColor:"grey", alignSelf:"center", borderRadius:10, marginTop:12, position:"absolute"}}></View>
            <Ionicons name="close-outline" color="grey" size={30} onPress={toggleModal} style={{alignSelf:"flex-end", marginRight:5}}/>
           
            <View style={{ justifyContent:"space-evenly", flex:1, backgroundColor:"white"}}>
          <Text style={{fontSize:25, fontWeight:"bold", alignSelf:"center"}}>Fotoğraf Yükle</Text>
            <TouchableOpacity
            style={{backgroundColor:"#d2302f", width:300, height:50, alignSelf:"center", alignItems:"center", justifyContent:"center", borderRadius:25}}
            onPress={showImagePicker}
            >
                <Text style={{fontSize:20,color:"white", fontWeight:"600"}}>Galerimden seç</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={{backgroundColor:"#d2302f", width:300, height:50, alignSelf:"center", alignItems:"center", justifyContent:"center", borderRadius:25}}
            onPress={openCamera}
            >
                <Text style={{fontSize:20, color:"white", fontWeight:"600"}}>Fotoğraf çek</Text>
            </TouchableOpacity>
            </View>
        </View>
      </Modal>
                  {/* --- Modal --- */}
            <Text style={[styles.text, {fontWeight:"bold" ,marginTop:5}]}>
                {name}
            </Text>
      
            </View>
            <View style={styles.userInfo}>
                <View style={{alignItems:"center", justifyContent:"center"}}>
                <Text style={{fontSize:18, fontWeight:"bold"}}>
                    {GonderiCount}
                </Text>
                <Text style={{fontSize:15, color:"grey"}}>
                    GÖNDERİ
                </Text>
                </View>
                
                <TouchableOpacity onPress={()=> navigation.navigate("Followers")} style={{justifyContent:"center"}}>
                <View style={{alignItems:"center", justifyContent:"center"}}>
                <Text style={{fontSize:18, fontWeight:"bold"}}>
                    {myFollowers}
                </Text>
                <Text style={{fontSize:15, color:"grey"}}>
                    TAKİPÇİLER
                </Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> navigation.navigate("Followed")} style={{justifyContent:"center"}}>
                <View style={{alignItems:"center", justifyContent:"center"}}>
                <Text style={{fontSize:18, fontWeight:"bold"}}>
                    {followCount}
                </Text>
                <Text style={{fontSize:15, color:"grey"}}>
                    TAKİP EDİLEN
                </Text>
                </View>
                </TouchableOpacity>

            </View>
           
            <View style={styles.userPhotoAndText}>
            <FlatList 
            data={images}
            horizontal={false}
            keyExtractor={(item) => item.key}
            renderItem={({item}) => 
                (
                    <View style={{paddingHorizontal:1, alignItems:"center", paddingTop:5}}>
                <Image source={{uri: item.image}} style={{width:Dimensions.get('screen').width / 1.1, height:250, }} />
                </View>
            )}
            />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cont:{
        flex:1,
        backgroundColor:"white",
        paddingTop: Constants.statusBarHeight
    },
    userImage:{
        flex:3,
        justifyContent:"center",
        alignItems:"center"
    },
    userInfo:{
        flex:1,
        flexDirection:"row",
        justifyContent:"space-around",
    },
    userPhotoAndText:{
        flex:4,
        borderTopWidth:1,
        borderColor:"grey",
    },
    text:{
        fontSize:20,
        fontWeight:'400',

    },
    button:{
        width:170,
        height:45,
        borderRadius:25,
        justifyContent:"center",    
        borderColor:"grey",
        borderWidth:1
        
    }
})


export default Profile
