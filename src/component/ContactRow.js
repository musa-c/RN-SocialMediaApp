import React from "react";
import { Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ContactRow = ({ name, subtitle, onPress, style, avatar }) => {
  return (
    <TouchableOpacity style={[styles.row, style]} onPress={onPress}>
      <Image style={styles.avatar} source={{ uri: avatar }} />

      <View style={styles.textsContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontSize: 20,
    color: "white",
  },
  textsContainer: {
    flex: 1,
    marginStart: 16,
  },
  name: {
    fontSize: 16,
  },
  subtitle: {
    marginTop: 2,
    color: "#565656",
  },
});

export default ContactRow;
