import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Cell = ({ title, icon, tintColor, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.cell, style]} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: tintColor }]}>
        <Ionicons name={icon} size={24} color={"white"} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Ionicons name="chevron-forward-outline" size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 16,
    marginStart: 16,
    flex: 1,
  },
  iconContainer: {
    height: 32,
    width: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Cell;
