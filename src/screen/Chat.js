import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, Send, InputToolbar } from "react-native-gifted-chat";
import firebase from "firebase/compat/app";
import "dayjs/locale/tr";
import { View } from "react-native-web";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput } from "react-native";

const Chat = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  //   console.log(route.params.id)

  const [uid, setUID] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    let unmounted = false;
    firebase.auth().onAuthStateChanged((user) => {
      if (!unmounted) {
        setUID(user?.uid);
        setAvatar(user.photoURL);
      }
    });

    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => {
    let unmounted = false;
    firebase
      .firestore()
      .doc("Chats/" + route.params.id)
      .onSnapshot((doc) => {
        if (!unmounted) {
          setMessages(
            doc.data()?.messages ?? [],
            doc.data().messages.user?.avatar ?? ""
          );
        }
      });
    return () => {
      unmounted = true;
    };
  }, [route.params.id]);

  const onSend = useCallback(
    (m = []) => {
      let unmounted = false;
      if (!unmounted) {
        firebase
          .firestore()
          .doc("Chats/" + route.params.id)
          .set({ messages: GiftedChat.append(messages, m) }, { merge: true });
      }
      // append içindeki 1. parametre mevcut mesajlar, 2. parametre gönder butonuna basıldıktan sonraki mesajlar
      // bu iki mesajları birleştiriyoruz.
      return () => {
        unmounted = true;
      };
    },
    [route.params.id, messages]
  );

  return (
    <GiftedChat
      messages={messages.map((x) => ({
        ...x,
        createdAt: x.createdAt?.toDate(),
      }))}
      // görüntülenecek mesajlar.
      onSend={(messages) => onSend(messages)}
      // mesaj gönderdikten sonra onSend metotu çalışıyor.
      user={{
        _id: uid,
        avatar: avatar,
      }}
      placeholder=""
      locale="tr"
      alwaysShowSend={true}
      renderSend={(props) => (
        <Send
          {...props}
          containerStyle={{
            justifyContent: "center",
            alignItems: "center",
            marginEnd: 10,
          }}
        >
          <Ionicons name="send" size={25} color="black" />
        </Send>
      )}
      textInputStyle={styles.InputStyle}
      renderInputToolbar={(props) => (
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: "gainsboro",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  InputStyle: {
    backgroundColor: "white",
    borderRadius: 20,
    marginEnd: 10,
    padding: 10,
    textAlign: "justify",
    paddingTop: 10,
  },
});

export default Chat;
