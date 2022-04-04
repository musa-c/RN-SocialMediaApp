import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Dimensions, Pressable, FlatList, Image, RefreshControl, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { Avatar } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Header from '../component/Header';
import IconFeather from 'react-native-vector-icons/Feather';
import Modal from "react-native-modal";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import firebase, {arrayUnion} from 'firebase/compat/app';
import {Ionicons, Entypo,} from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';



const Home = ({navigation}) => {
    const [UserName, setUserName] = useState();
    const [Name, setName] = useState();
    const [MyId, setMyId] = useState();
    const [isModalVisible, setModalVisible] = useState();
    const [userId, setuserId] = useState([]);
    const [UserData, setUserData] = useState([]);
    const [docsLength, setdocsLength] = useState();
    const [avatar, setAvatar] = useState();

    // SHFT ALT F YAPMADIN

    useEffect(() => {
        let unmounted = false;
        const user = firebase.auth().currentUser;
         firebase.firestore().collection("user").doc(user.uid).collection("follow").onSnapshot(snapshot => {
            const userId = [];
            snapshot.forEach((docs)=>{
                userId.push(docs.data().id)
            })
            if (!unmounted) {
             setuserId(userId);
            }
         })

         firebase.firestore().collection("user").doc(user.uid).onSnapshot((snapshot)=>{
            if (!unmounted) {
            setUserName(snapshot.data().UserName)
            setName(snapshot.data().name)
            setMyId(snapshot.id) // Doküman Id'sini getirir.
            setAvatar(snapshot.data().avatar)
        }
         })
 
         return () => {
            unmounted = true;
          };

     }, [])
     useEffect(()=> {
        let unmounted = false;
        const unsubscribe = navigation.addListener('tabLongPress', () => {
            if (!unmounted) {
            setModalVisible(true);
        }
        });
        
          return unsubscribe;
          return () => {
            unmounted = true;
          };
     }, [navigation])

    var [Comment, setComment] = useState([])

    useEffect(()=>{
        let unmounted = false;
        var UserData = [];
        var comment = [];
        
        const user = firebase.auth().currentUser;
        userId.forEach(element => {
        firebase.firestore().collection("user").doc(element).onSnapshot((snapshot)=>{
                
            firebase.firestore().collection("user").doc(element).collection("images").onSnapshot((querySnapshot)=>{
                querySnapshot.forEach((imageDocs)=>{
                    
                    // isLike
                    firebase.firestore().collection("user").doc(element).collection("images")
                    .doc(imageDocs.id)
                    .collection("likes").where("id", "==", user.uid).get().then((doc)=>{
                            UserData.push({
                                ...imageDocs.data(),
                                key: imageDocs.id,
                                ...snapshot.data(),
                                userId: element,
                                isLike: (!doc.empty),
                                comment: Comment
                                
                            });
                            if (!unmounted) {
                                setUserData(UserData);
                                
                            }
                    })
                })
            })
        })
      
    });
    return () => {
        unmounted = true;
      };
    }, [userId, Comment])

    const [InputMessage, setInputMessage] = useState("");


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
           uploadImage(result.uri, filename);
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
               uploadImage(result.uri, filename);
             }
       }
   
   
       const uploadImage = async (uri, imageName)  => {
           const response = await fetch(uri);
           const blob = await response.blob();
       
           var ref = await firebase.storage().ref("images/").child(imageName);
           return ref.put(blob).then(()=>{
               firebase.storage().ref("images/").child(imageName).getDownloadURL().then((url)=> {
                   const user = firebase.auth().currentUser;
                   firebase.firestore().collection("user").doc(user.uid).collection("images").doc().set({
                       image: url
                   })
          
               }).then(()=>{
                   console.log("Başarılı!")
               })
           });
         } 

        const renderEmptyContainer = () =>{
            return(
                <View>
                    <Text>Henüs takip ettiğin kimse yok.</Text>
                </View>
            )
        }


        const [elemetIsLike, SetElemetIsLike] = useState(true)





        const Like = (userId, PhotoId, item) => {
            firebase.firestore().collection("user").doc(userId).collection("images").doc(PhotoId).collection("likes").add({
                name: Name,
                UserName: UserName,
                id: MyId
            }).then(()=>{
             
            })
            
        }

        const RemoveLike = (userId, PhotoId) =>{
            firebase.firestore().collection("user").doc(userId).collection("images").doc(PhotoId).collection("likes")
            .where("UserName", "==", UserName).get().then((querySnapshot)=>{
                querySnapshot.forEach((doc)=>{
                    doc.ref.delete();
                })
            
            }).then(()=>{
               

            })
            
        }

        // const Message = (userId, PhotoId) => {

        //     firebase.firestore().collection("user").doc(userId).collection("images").doc(PhotoId).collection("comments")
        //     .where("UserName", "==", UserName).get().then((doc)=>{
        //        if(!(doc.empty)){
        //              // doc varsa
        //           doc.forEach((snapshot)=>{
        //             firebase.firestore().collection("user").doc(userId).collection("images").doc(PhotoId).collection("comments").doc(snapshot.id).set({
        //                 name: Name,
        //                 UserName: UserName,
        //                 avatar: avatar,
        //                 comment: [InputMessage]
        //             }, {merge:true})                    
        //           })
        //         }else{
        //             // doc yoksa
        //             firebase.firestore().collection("user").doc(userId).collection("images").doc(PhotoId).collection("comments").add({
        //                 name: Name,
        //                 UserName: UserName,
        //                 avatar: avatar,
        //                 comment: arrayUnion(InputMessage)
        //             })
        //         }
        //     })
            
            
        // }

        

    return (
        
<View>
    <StatusBar backgroundColor="white" barStyle="dark-content" />
        <Header />
   
        <Modal isVisible={isModalVisible}
          swipeDirection="down"
          onBackdropPress = { ( )  =>  setModalVisible ( false ) } 
            onSwipeComplete = { ( )  =>  setModalVisible ( false ) }
        >
            <View style={{backgroundColor:"white", justifyContent:"space-evenly", alignItems:"center", borderRadius:20, height: Dimensions.get('screen').height / 3.5}}>
                <Text style={{fontSize:25, fontWeight:"700"}}>Fotoğraf Yükle</Text>
                <Pressable
                 onPress={showImagePicker}
                 style={{flexDirection:"row", alignItems:"center", backgroundColor:"#90caf9", paddingVertical:10, paddingHorizontal:40, borderRadius:10}}>
                
                    <Ionicons name="images" size={25} style={{paddingRight:10}}/>
                    <Text style={{fontSize:20, fontWeight:"500"}}>Galerimden Çek</Text></Pressable>
                <Pressable 
                onPress={openCamera}
                style={{flexDirection:"row", alignItems:"center", backgroundColor:"#90caf9", paddingVertical:10, paddingHorizontal:40, borderRadius:10}}>
                    <Ionicons name="camera" size={25} style={{paddingRight:10}}/>
                    <Text style={{fontSize:20, fontWeight:"500", textAlign:"center"}}>Fotoğraf Çek</Text>
                    </Pressable>             
            </View>

        </Modal>
        <View style={{paddingBottom: 50}}>
        <FlatList 
        data={UserData}
        style={{padding:10, backgroundColor:"white", paddingTop:0,}}
        ListEmptyComponent={renderEmptyContainer}
        keyExtractor={(item) => item.key}
        // extraData={refresh} 
        renderItem={({item}) =>
        (
            <>
            <View style={{flexDirection:"row", marginTop:2,}}>
                <Pressable  onPress={() => navigation.navigate({name: "UsersProfile", params:{id: item.userId, UserName: item.UserName}})}>
            <View style={{alignItems:"center", marginStart:10 ,marginVertical:6,}}>
          <Avatar.Image size={45} label="MC" source={{uri: item.avatar}}/>
          </View>
          </Pressable>
        <View style={{
            flex:1,
            flexDirection:"row",
            justifyContent:"space-between",
            marginHorizontal:10,
            alignItems:"center",
            
            
        }}>
          <Pressable onPress={() => navigation.navigate({name: "UsersProfile", params:{id: item.userId, UserName: item.UserName}})}>
            <View>
                <Text style={{fontSize:18}}>{item.UserName}</Text>
                <Text style={{fontSize:13, color:"grey"}}>{item.name}</Text>
            </View>
            </Pressable>
            {/* <View>
            <IconFeather name="more-horizontal" size={20} color="black"/>
            </View> */}
        </View>
        </View>

        <View style={{justifyContent:"center", alignItems:"center", padding:10}}>
            <Image source={{uri: item.image}} style={{width:Dimensions.get('screen').width / 1.1, height:450, borderRadius:10, }}/>
        </View>
        
        <View style={{flexDirection:"row", marginHorizontal:10,}}>

       {
           (()=>{
               
                    if (item.isLike) { // true ise 
                      return(
                        <Entypo name="heart" size={32} color="red" onPress={() => {RemoveLike(item.userId, item.key)}}/> 
                      )  
                    }else{
                        return(
                            <Entypo name="heart-outlined" size={32} color="black" onPress={() => {Like(item.userId, item.key, item)}}/>
                        )
                    }               
        })()}

         
        <View style={{
            flexDirection:"row",
            flex:1,
            // backgroundColor:"blue",
            justifyContent:"space-between",
           
        }}>
            
            <View style={{ marginHorizontal:10,}}>
            <IconFeather name="message-circle" size={30} color="black"/>
            </View>
           
        </View>
       
        </View>
        <Text style={{marginHorizontal:10}}>{item.comment}</Text>
        <Text style={{marginHorizontal:10}}>Daha fazla yorum gör..</Text>
        <View style={{marginBottom:20, marginHorizontal:10, marginTop:5, flexDirection:"row"}}>

      
        <TextInput 
            placeholder='yorum yaz..'
            value={InputMessage}
            onChangeText={(text)=>setInputMessage(text)}
            style={{flex:1, fontSize:23, borderBottomColor:"grey", borderBottomWidth:StyleSheet.hairlineWidth}}
            
            />
           
       
        <IconFeather name="send" size={23} color="black" onPress={() => Message(item.userId, item.key)}/>
        
            </View>
        </>
        )}
        />         
        </View>   
            </View>
            
    )
}

const styles = StyleSheet.create({
    // cont:{
    //     flex:1,
    // },
    Post:{
       backgroundColor:"red",
    //    marginHorizontal:5, 
       marginVertical:5, 
       marginTop:20,
       flexDirection:"row"
    }

})


export default Home;
