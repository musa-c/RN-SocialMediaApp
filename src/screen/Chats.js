import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import firebase from "firebase/compat/app";
import ContactRow from "../component/ContactRow";

const Chats = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    let unmounted = false;
    firebase
      .firestore()
      .collection("Chats")
      .where("users", "array-contains", firebase.auth()?.currentUser?.email) // benim mailimin içerdiği dokümanları getirecek!.
      .onSnapshot((snapshot) => {
        if (!unmounted) {
          setChats(snapshot.docs);
        }
      });
    const user = firebase.auth().currentUser;

    firebase
      .firestore()
      .collection("user")
      .doc(user.uid)
      .onSnapshot((snapshot) => {
        if(!unmounted){
          setAvatar(snapshot.data().avatar);
        }
      });

    return () => {
      unmounted = true;
    };
  }, []);

  const user = firebase.auth().currentUser;
  const [name, setName] = useState();
  const [avatar, setAvatar] = useState();

  // map fonksiyon dizinin içindeki her bir elemana sırasıyla ulaşır. Yazdığın işlemleri yapar.

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        {chats.map((chat) => (
          <React.Fragment key={chat.id}>
            <ContactRow
              avatar={
                chat.data().avatars[0] == avatar &&
                chat.data().avatars[1] == avatar
                  ? chat.data().avatars[0]
                  : chat.data().avatars.find((x) => x !== avatar)
              }
              name={chat
                .data()
                .names.find(
                  (x) => x !== firebase.auth().currentUser?.displayName
                )}
              subtitle={
                chat.data().messages.length === 0
                  ? "Henüz mesaj yok"
                  : chat.data().messages[0].text
              }
              onPress={() => navigation.navigate("Chat", { id: chat.id })}
            />
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
};

export default Chats;
