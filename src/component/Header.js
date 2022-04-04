import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Constants from "expo-constants";

const Header = () => {
  return (
    <View style={styles.cont}>
      <Text style={{ fontSize: 35 }}>ISOCIETY</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cont: {
    backgroundColor: "white",
    alignItems: "flex-start",
    paddingStart: 10,
    borderBottomWidth: 0.3,
  },
});

export default Header;
