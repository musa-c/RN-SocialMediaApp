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

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      // signInWithEmailAndPassword sorgulanmadan aşşağıdaki işlemlere geçmez!
      // async/await koyduğumuz yer kod bloğunu orada durduruyor. İşlem gerçekleşene kadar aşşağısındaki kodları çalıştırmaz.
      navigation.navigate("Main");
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
            placeholder="E-mail"
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <TextInput
            placeholder="Şifre"
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />

          <TouchableOpacity onPress={() => signIn()}>
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
                Giriş Yap
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
        <Text>Hesabın Yok mu? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={{ fontWeight: "bold" }}>Kaydol</Text>
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

export default SignIn;
