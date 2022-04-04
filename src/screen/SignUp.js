import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import firebase from "firebase/compat/app";

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [UserName, setUserName] = useState("");

  const createAccount = async () => {
    try {
      const response = firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      await response.then((User) => {
        firebase.firestore().collection("user").doc(User.user.uid).set({
          name: name,
          email: email,
          UserName: UserName,
          avatar:
            "https://firebasestorage.googleapis.com/v0/b/isociety-1d816.appspot.com/o/avatars%2FdefaultAvatar.png?alt=media&token=70cc3732-7fcb-4f49-bf1f-548032358f6e",
        });
      });

      (await response).user.updateProfile({
        displayName: name,
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/isociety-1d816.appspot.com/o/avatars%2FdefaultAvatar.png?alt=media&token=70cc3732-7fcb-4f49-bf1f-548032358f6e",
      });

      navigation.navigate("SignIn");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <LinearGradient
      colors={["rgba(0, 94, 112, 0.3)", "grey"]}
      style={styles.linearGradient}
    >
      <View style={styles.cont}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "700",
            marginBottom: 20,
          }}
        >
          ISOCİETY
        </Text>

        <View style={{ width: 280 }}>
          <TextInput
            placeholder="E-Mail"
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <TextInput
            placeholder="İsim"
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
          />

          <TextInput
            placeholder="Kullanıcı adı"
            style={styles.input}
            value={UserName}
            onChangeText={(text) => setUserName(text)}
          />

          <TextInput
            placeholder="Şifre"
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />

          <TouchableOpacity onPress={() => createAccount()}>
            <View
              style={{
                borderRadius: 7,
                backgroundColor: "#e8eaf6",
                height: 45,
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  padding: 10,
                  fontWeight: "500",
                  fontSize: 17,
                }}
              >
                Kaydol
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "flex-end",
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        <Text>Hesabın var mı? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={{ fontWeight: "bold" }}>Giriş yap</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  cont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 7,
    paddingVertical: 10,
    paddingLeft: 7,
    marginTop: 20,
    height: 45,
  },

  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
});

export default SignUp;
