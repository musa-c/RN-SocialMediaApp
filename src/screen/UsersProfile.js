import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  Pressable,
} from "react-native";
// import { Avatar } from 'react-native-paper';
import IconFeather from "react-native-vector-icons/Feather";
import firebase from "firebase/compat/app";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";

const UsersProfile = ({ navigation, route }) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [UserName, setUserName] = useState();
  const [avatar, setAvatar] = useState("");
  const [images, setImages] = useState([]);
  const [gonderiCount, setGonderiCount] = useState(0);
  const [followCount, setFollowCount] = useState(0);
  const [myFollowers, setMyFollowers] = useState(0);
  const [usersQuery, setUsersQuery] = useState([]);
  const userId = route.params.id;
  // console.log(route.params.id)

  useEffect(() => {
    let unmounted = false;

    firebase
      .firestore()
      .collection("user")
      .doc(userId)
      .onSnapshot((snapshot) => {
        if (!unmounted) {
          setUserName(snapshot.data().UserName);
          setAvatar(snapshot.data().avatar);
          setName(snapshot.data().name);
          setEmail(snapshot.data().email.toLowerCase())
          isFollow(snapshot.data().UserName);
        }
      });
    firebase
      .firestore()
      .collection("user")
      .doc(userId)
      .collection("images")
      .onSnapshot((querySnapshot) => {
        const images = [];
        var gonderiCount = 0;
        querySnapshot.forEach((documentSnapshot) => {
          images.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
          gonderiCount += 1;
          if (!unmounted) {
            setImages(images);
            setGonderiCount(gonderiCount);
          }
        });
      });


      // follow count (takip ettiklerim)
      firebase.firestore().collection("user").doc(userId).collection("follow").onSnapshot((querySnapshot)=>{
        // console.log("doküman sayısı: ", querySnapshot.docs.length)
        if (!unmounted){
          setFollowCount(querySnapshot.docs.length)
        }
        // console.log("dokümanlar: ", querySnapshot.docs) // dokümanları dizi olarak döndürür.
      })

      firebase.firestore().collection("user").doc(userId).collection("MyFollowers").onSnapshot((querySnapshot)=>{
        if (!unmounted){
          setMyFollowers(querySnapshot.docs.length)
        }
      })

    
    
    
    return () => {
      unmounted = true;
    };
  }, []);


  const [followButton, setFollowButton] = useState(false);

  const [myUserName, setMyUserName] = useState();

  const isFollow = (UserName) => {
    const my = firebase.auth().currentUser;
    firebase.firestore().collection("user").doc(my.uid).collection("follow").onSnapshot((snapshot)=>{
        const users = [];
        snapshot.forEach((QueryDocs)=>{
            users.push(QueryDocs.data().UserName)
        })
        if(users.includes(UserName)){
          setFollowButton(true)  
        }else{
          setFollowButton(false)    
        }
      firebase.firestore().collection("user").doc(my.uid).onSnapshot((SnapShot)=>{
        setMyUserName(SnapShot.data().UserName)
      })

    })
   
  } 
  
  const Follow = () => {
      const my = firebase.auth().currentUser;

      firebase.firestore().collection("user").doc(my.uid).onSnapshot((snapshot)=>{
        firebase.firestore().collection("Chats").where("users", "in" , [[email, my.email]]).get().then((doc)=>{
        firebase.firestore().collection("Chats").where("users", "in", [[my.email, email]]).get().then((doc_1)=>{
          if (doc.empty && doc_1.empty) {
            firebase.firestore().collection("user").doc(my.uid).onSnapshot((snapshot)=>{
              firebase.firestore().collection("Chats").add({
                users:[email,my.email],
                names:[name, my.displayName],
                avatars: [avatar,  snapshot.data().avatar],
                messages: []
            })
          })
          }
        })
        }) 
 
      })
      
      firebase.firestore().collection("user").doc(userId).collection("MyFollowers").where("UserName", "==", UserName).get().then((doc)=>{
        // console.log(doc.empty)
        if (doc.empty) {
          firebase.firestore().collection("user").doc(my.uid).onSnapshot((snapshot)=>{
            firebase.firestore().collection("user").doc(userId).collection("MyFollowers").add({
              name: snapshot.data().name,
              email: snapshot.data().email,
              avatar: snapshot.data().avatar,
              UserName: snapshot.data().UserName,
              id: snapshot.id
          })
          })
        }
      })
      
      firebase.firestore().collection("user").doc(my.uid).collection("follow").add({
          name: name,
          UserName: UserName,
          id: userId,
          avatar: avatar
      }).then((doc)=>{
          setFollowButton(true)
      })

      
  

      
      
  }

  const UnFollow = () => {
      const my = firebase.auth().currentUser;
      firebase.firestore().collection("user").doc(my.uid).collection("follow").where("UserName","==", UserName).get().then((querySnapshot)=>{
          querySnapshot.forEach((doc) => {
            firebase.firestore().collection("user").doc(my.uid).collection("follow").doc(doc.id).delete().then(()=> {
                setFollowButton(false)
            })
          })
      })
      firebase.firestore().collection("user").doc(my.uid).onSnapshot((snapshot)=>{
      firebase.firestore().collection("user").doc(userId).collection("MyFollowers").where("UserName", "==", snapshot.data().UserName).get().then((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
          doc.ref.delete();
        })
      })
      })
  }



  const SendMessage = () => {
    const my = firebase.auth().currentUser;

      firebase.firestore().collection("user").doc(my.uid).onSnapshot((snapshot)=>{
        firebase.firestore().collection("Chats").where("users", "in" , [[email, my.email]]).get().then((doc)=>{
        firebase.firestore().collection("Chats").where("users", "in", [[my.email, email]]).get().then((doc_1)=>{
          if (doc.empty == false) { // boş değil ise
           doc.forEach((docId)=>{
            //  console.log(docId.id)
            navigation.navigate("Chat", {id: docId.id})
           })
          }else if (doc_1.empty == false){
            doc_1.forEach((docId)=>{
              navigation.navigate("Chat", {id: docId.id})
             })
          }else{
            firebase.firestore().collection("user").doc(my.uid).onSnapshot((snapshot)=>{
              firebase.firestore().collection("Chats").add({
                users:[email,my.email],
                names:[name, my.displayName],
                avatars: [avatar,  snapshot.data().avatar],
                messages: []
            }).then((docM)=>{
              navigation.navigate("Chat", {id: docM.id})
            })
          })
          }
        })
        }) 
      })

    
  }

  return (
    <View style={styles.cont}>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
      </TouchableOpacity>
      <View style={styles.userImage}>
        {avatar == undefined ? (
          <Avatar
            size={100}
            rounded
            source={{
              uri: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg",
            }}
          > 
          </Avatar>
        ) 
        : 
        (
          <Avatar
            size={100}
            rounded
            source={{ uri: avatar !== "" ? avatar : undefined }}
          ></Avatar>
        )}

        <Text style={[styles.text, {marginTop: 5, fontWeight:"bold" }]}>
          {name}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <View style={{ alignItems: "center",}}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {gonderiCount.toString()}
          </Text>
          <Text style={{ fontSize: 15, color: "grey" }}>GÖNDERİ</Text>
        </View>

        <Pressable onPress={()=> navigation.navigate("UserFollowers", {id: userId})}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{myFollowers}</Text>
          <Text style={{ fontSize: 15, color: "grey" }}>TAKİPÇİLER</Text>
        </View>
        </Pressable>

        <Pressable onPress={()=> navigation.navigate("UserFollowed", {id: userId})}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{followCount}</Text>
          <Text style={{ fontSize: 15, color: "grey" }}>TAKİP EDİLEN</Text>
        </View>
        </Pressable>

      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          flex: 1,
          alignItems:"center",
          // backgroundColor:"red"
        }}
      >
           {
                followButton == false ? (
                    <TouchableOpacity
                    onPress={Follow}
                    >
                    <View style={styles.FollowButton}>
           
                    <Text
                      style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
                    >
                      TAKİP ET
                    </Text>
                  </View>
                  </TouchableOpacity>
                )
                :
                (
                    <TouchableOpacity
                    onPress={UnFollow}
                    >
                    <View style={styles.UnFollowButton}>
                    <Text
                      style={{ textAlign: "center", fontSize: 17, fontWeight: "bold" }}
                      
                    >
                      TAKİPTEN ÇIKAR
                    </Text>
                  </View>
                  </TouchableOpacity>
                )
            }
       <TouchableOpacity 
       onPress={SendMessage}>
        <View style={styles.messageBtn}>
          <Text
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            MESAJ AT
          </Text>
        </View>
        </TouchableOpacity>
      </View>

      <View style={styles.userPhotoAndText}>
        <FlatList
          data={images}
          horizontal={false}
          renderItem={({ item }) => (
            <View
              style={{
                paddingHorizontal: 1,
                alignItems: "center",
                // marginHorizontal:10
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: Dimensions.get('screen').width / 1.1,
                  borderRadius:10,
                  height: Dimensions.get('screen').height / 2.5,
                  marginTop:10,
                }}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    // alignItems:"center"
    backgroundColor: "white",
  },
  userImage: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 0.8,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems:"center"
  },
  userPhotoAndText: {
    flex: 5,
    borderTopWidth: 1,
    borderColor: "grey",
  },
  text: {
    fontSize: 20,
    fontWeight: "400",
  },
  FollowButton: {
    width: 170,
    height: 45,
    backgroundColor: "#81d4fa",
    borderRadius: 25,
    justifyContent: "center",
  },
  messageBtn:{
    width: 170,
    height: 45,
    backgroundColor: "#81d4fa",
    borderRadius: 25,
    justifyContent: "center",
  },
  
  UnFollowButton:{
    width: 170,
    height: 45,
    backgroundColor: "white",
    borderRadius: 25,
    justifyContent: "center",
    borderColor:"grey",
    borderWidth:1
  },
  
});

export default UsersProfile;
