import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./src/Tab/Tab";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import SignIn from "./src/screen/SignIn";
import SignUp from "./src/screen/SignUp";

const firebaseConfig = {
  apiKey: "AIzaSyDjZTvYu8Gd6ZvQ_Tetzcil0yBMRBMO_d4",
  authDomain: "isociety-1d816.firebaseapp.com",
  projectId: "isociety-1d816",
  storageBucket: "isociety-1d816.appspot.com",
  messagingSenderId: "618348149432",
  appId: "1:618348149432:web:8db53504e8a9beeeb4d24d",
};

firebase.initializeApp(firebaseConfig);

export default function App() {
  
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
